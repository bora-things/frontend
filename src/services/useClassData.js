import { ref } from 'vue'

export function useClassData({id}) {
  const classData = ref(null)

  async function fetchClassData() {
    try {
      const response = await fetch('/src/mocks/ClassMockData.json')
      const data = await response.json()
      classData.value = data.find((item) => item.id === id)
  } catch (error) {
      console.error('Error fetching class data:', error)
    }
  }
  return {
    classData,
    fetchClassData
  }
}
