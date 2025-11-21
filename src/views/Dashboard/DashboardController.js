import api from '@/config/axios.config'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
export async function handleRemoveInterestedSubjectRequest(subjectId) {
  try {
    await api.delete(`/api/students/me/interests/${subjectId}`)
  } catch (error) {
    toast.error(error.response.data.message || 'Erro ao ao adicionar disciplina interessada')
  }
}

export async function handleAddInterestedSubjectRequest({ subjectCode, year, period }) {
  try {
    const formData = {
      subjectCode,
      year,
      period
    }
    await api.post(`/api/students/me/interests`, formData)
  } catch (error) {
    toast.error(error.response.data.message || 'Erro ao adicionar disciplina interessada', {
      style: {
        width: '25%'
      },
      pauseOnHover: true
    })
  }
}

export async function handleInterestedSubjectsRequest({ signal } = {}) {
  try {
    const response = await api.get('/api/students/me/interests', { signal })
    return response.data
  } catch (error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      return
    }
    console.error('Error fetching interested subjects:', error)
    return []
  }
}

// Busca os dados do calendário acadêmico
export async function fetchCalendarData() {
  try {
    const response = await api.get('/api/calendars')
    return response.data
  } catch (error) {
    console.error('Erro ao buscar calendário:', error)
    return []
  }
}

// Verifica se a data atual está dentro de um período
function isDateInRange(startDate, endDate) {
  if (!startDate || !endDate) return false
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  return now >= start && now <= end
}

// Determina o tipo de período atual (matrícula, rematrícula, ou nenhum)
export function getCurrentEnrollmentPeriod(calendarData) {
  const now = new Date()

  for (const period of calendarData) {
    // Verifica matrícula
    if (isDateInRange(period.onlineEnrollmentStart, period.onlineEnrollmentEnd)  ) {
      return {
        type: 'enrollment',
        year: period.year,
        period: period.period,
        isReEnrollment: false
      }
    }

    // Verifica re rematrícula
    if (isDateInRange(period.reEnrollmentStart, period.reEnrollmentEnd) ) {
      return {
        type: 'reEnrollment',
        year: period.year,
        period: period.period,
        isReEnrollment: true
      }
    }
  }

  return null
}

// Busca enrollments com base no tipo de período
export async function fetchEnrollments(isReEnrollment = false) {
  try {
    const response = await api.get('/api/enrollments/me', {
      params: { reEnrollment: isReEnrollment }
    })

    //
    return response.data.map((enrollment) => {
      if (!isReEnrollment && enrollment.ano === 2025 && enrollment.periodo === 2) {
        return { ...enrollment, ano: 2026, periodo: 1 }
      }
      return enrollment
    })
  } catch (error) {
    console.error('Erro ao buscar enrollments:', error)
    return []
  }
}
