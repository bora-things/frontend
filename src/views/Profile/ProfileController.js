import api from '@/config/axios.config'

export async function getProfiles() {
  try {
    const response = await fetch('/src/views/Profile/ProfileMockData.json')
    return await response.json()
  } catch (error) {
    console.log('Error fetching profiles:', error)
  }
}

export async function getClassrooms(id) {
  try {
    const response = await api.get(`/api/classrooms/${id}`)
    return response.data
  } catch (error) {
    console.log('Error fetching classrooms:', error)
  }
}

export async function getInterests(id) {
  try {
    const response = await api.get(`/api/students/${id}/interests`)
    return response.data
  } catch (error) {
    console.log('Error fetching interests:', error)
  }
}
