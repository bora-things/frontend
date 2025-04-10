<script setup>
import { useNotifications } from '@/services/useNotifications'
import { Button } from 'ant-design-vue'
import { ref } from 'vue'

const isNotificationMenuOpen = ref(false)
const { notifications, handleUpdateNotificationStatus } = useNotifications()

function handleNotificationMenuClick() {
  isNotificationMenuOpen.value = !isNotificationMenuOpen.value
}

function getNotificationCreateDate(date) {
  const now = new Date()
  const notificationDate = new Date(date)
  const diff = now - notificationDate
  const diffInMinutes = Math.floor(diff / 1000 / 60)
  const diffInHours = Math.floor(diff / 1000 / 60 / 60)
  const diffInDays = Math.floor(diff / 1000 / 60 / 60 / 24)
  const diffInMonths = Math.floor(diff / 1000 / 60 / 60 / 24 / 30)
  const diffInYears = Math.floor(diff / 1000 / 60 / 60 / 24 / 30 / 12)

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  } else if (diffInHours < 24) {
    return `${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  } else if (diffInDays < 30) {
    return `${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
  } else if (diffInMonths < 12) {
    return `${diffInMonths} mês${diffInMonths > 1 ? 'es' : ''}`
  } else {
    return `${diffInYears} ano${diffInYears > 1 ? 's' : ''}`
  }
}
</script>

<template>
  <div class="flex justify-end z-50">
    <button class="relative bg-transparent" @click="handleNotificationMenuClick">
      <div class="bottom-1 right-0 w-2 h-2 bg-red-500 absolute rounded-full" v-if="notifications.length > 0"></div>
      <v-icon name="md-notifications" scale="1.5" />
    </button>
    <div
      v-if="isNotificationMenuOpen"
      class="absolute right-3 bg-neutral-700 p-4 rounded-md shadow-lg transition-all ease-in-out duration-300 w-[90%] md:w-auto max-h-[70vh] overflow-y-auto custom-scrollbar"
    >
      <div class="border-b border-bp_neutral-500 mb-4 pb-2 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <h4 class="text-sm md:text-base">Notificações</h4>
          <span
            class="w-5 h-5 text-xs flex items-center justify-center rounded-full bg-white text-black"
            >{{ notifications.length }}</span
          >
        </div>
        <button @click="isNotificationMenuOpen = false">
          <v-icon name="md-close" scale="1" />
        </button>
      </div>
      <ul class="flex flex-col gap-2">
        <li v-if="notifications.length === 0" class="text-white text-sm md:text-base">
          Nenhuma notificação
        </li>
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="text-white mb-2 flex flex-col"
        >
          <span class="text-xs md:text-sm self-end"
            >Recebido há {{ getNotificationCreateDate(notification.createdAt) }}
          </span>
          <div class="flex flex-wrap items-center gap-4">
            <img
              v-if="notification.imageUrl"
              :src="notification.imageUrl"
              alt="Imagem do usuário"
              class="h-8 w-8 md:h-10 md:w-10 rounded-full"
            />
            <v-icon
              v-else
              name="md-person"
              class="text-black bg-white rounded-full p-1"
              scale="2"
            />
            <div class="flex-1">
              <p class="font-bold text-sm md:text-base">{{ notification.name }}</p>
              <p class="text-xs md:text-sm">{{ notification.course }}</p>
              <p class="text-xs md:text-sm">{{ notification.period }}º Período</p>
            </div>
            <div class="flex gap-2 ml-auto">
              <Button
                type="primary"
                class="text-white bg-green-500 hover:!bg-green-600 border-none text-xs md:text-sm"
                @click="handleUpdateNotificationStatus(notification, 'accepted')"
              >
                Aceitar
              </Button>
              <Button
                type="primary"
                class="text-white bg-red-500 hover:!bg-red-600 border-none text-xs md:text-sm"
                @click="handleUpdateNotificationStatus(notification, 'rejected')"
              >
                Recusar
              </Button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
