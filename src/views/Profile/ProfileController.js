import api from '@/config/axios.config'
import { useToast } from 'vue-toast-notification'

export async function getProfiles() {
  try {
    const response = await fetch('/src/views/Profile/ProfileMockData.json')
    return await response.json()
  } catch (error) {}
}

export async function getClassrooms(id) {
  try {
    const response = await api.get(`/api/classrooms/${id}`)
    return response.data
  } catch (error) {}
}

export async function getInterests(id) {
  try {
    const response = await api.get(`/api/students/${id}/interests`)
    return response.data
  } catch (error) {}
}

export async function deleteFriendship(id) {
  try {
    await api.delete('/api/users/me/friends?id=' + id)
  } catch {}
}

export async function sendFriendRequest(id) {
  try {
    await api.post('/api/friend-requests', {
      to_id: id,
    })
    return true
  } catch (error) {
    useToast().error(error.response.data.message)
    return false
  }
}

export async function updateFriendRequest(id,status) {
  try {
    await api.patch("/api/friend-requests", {
      request_id: id,
      status,
    });
    return true
  } catch (error) {
    useToast().error(error.response.data.message)
    return false
  }
}
