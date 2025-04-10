import api from '@/config/axios.config'
import { onMounted, ref } from 'vue'

export function useUser() {
  const user = ref(null)

  async function fetchUser() {
    try {
      const response = await api.get('/api/students/me') // Caminho do mock
      const data = await response.data
      user.value = data
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  onMounted(() => {
    fetchUser()
  })

  return {
    user,
    fetchUser
  }
}
