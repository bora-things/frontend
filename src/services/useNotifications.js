import { onMounted, ref } from 'vue'

export function useNotifications() {
  const notifications = ref([])

  async function fetchNotifications() {
    try {
      const response = await fetch('/src/mocks/NotificationsMockData.json')
      const data = await response.json()
      notifications.value = data
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  async function handleUpdateNotificationStatus(notification, status) {
    //Irá realizar um update no status da notificação
    notifications.value = notifications.value.filter((item) => item.id !== notification.id)
  }

  onMounted(fetchNotifications)

  return {
    notifications,
    fetchNotifications,
    handleUpdateNotificationStatus
  }
}
