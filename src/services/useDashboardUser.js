import { ref } from 'vue'

export function useDashboardUser() {
  const user = ref(null)

  async function fetchUser() {
    try {
      const response = await fetch('/src/mocks/UserMockData.json') // Caminho do mock
      const data = await response.json()
      user.value = data
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  return {
    user,
    fetchUser
  }
}
