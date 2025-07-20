import api from '@/config/axios.config'
import { useToast } from 'vue-toast-notification'

const toast = useToast()
export async function handleRemoveInterestedSubjectRequest(subjectId) {
  try {
    await api.delete(`/api/users/interests/${subjectId}`)
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
    await api.post(`/api/users/interests`, formData)
  } catch (error) {
    toast.error(error.response.data.message || 'Erro ao adicionar disciplina interessada', {
      style: {
        width: '25%'
      },
      pauseOnHover: true,

    })
  }
}

export async function handleInterestedSubjectsRequest({ signal } = {}) {
  try {
    const response = await api.get('/api/users/interests', { signal })
    return response.data
  } catch (error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      return
    }
    console.error('Error fetching interested subjects:', error)
    return []
  }
}
