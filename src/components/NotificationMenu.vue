<script setup>
import api from "@/config/axios.config";
import { onMounted, ref } from "vue";

const isNotificationMenuOpen = ref(false);

function handleNotificationMenuClick() {
  isNotificationMenuOpen.value = !isNotificationMenuOpen.value;
}

const notifications = ref([]);
const updatingNotificationId = ref(null);

async function fetchNotifications() {
  try {
    const response = await api.get("/api/friend-requests");
    const data = response.data;
    notifications.value = data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

async function handleUpdateNotificationStatus(notification, status) {
  try {
    updatingNotificationId.value = notification.id; // Mark the notification as updating
    await api.patch("/api/friend-requests/update", {
      request_id: notification.id,
      status: status,
    });
    fetchNotifications();
  } catch (error) {
    console.error("Error updating notification status:", error);
  } finally {
    updatingNotificationId.value = null; // Reset the updating state
  }
}

function getName(name) {
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase()} ${
      names[names.length - 1].charAt(0).toUpperCase() +
      names[names.length - 1].slice(1).toLowerCase()
    }`;
  } else {
    return names[0];
  }
}

const isHeaderShadowVisible = ref(false);

function handleScroll() {
  const container = document.querySelector(".notification-container");
  if (container) {
    isHeaderShadowVisible.value = container.scrollTop > 0;
  }
}

onMounted(() => {
  fetchNotifications();
  const container = document.querySelector(".notification-container");
  if (container) {
    container.addEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <div class="flex justify-end">
    <button
      class="relative bg-bp_grayscale-800 border border-bp_neutral-600 rounded-full w-12 h-12"
      @click="handleNotificationMenuClick"
    >
      <div
        v-if="notifications.length > 0"
        class="top-1 right-0 w-3 h-3 bg-bp_green-100 absolute rounded-full"
      ></div>
      <v-icon name="md-notifications" scale="1.5" />
    </button>
    <div
      v-if="isNotificationMenuOpen"
      class="absolute right-3 bg-bp_grayscale-800 p-4 rounded-md shadow-lg transition-all ease-in-out duration-300 w-[90%] md:w-96 max-h-[70vh] overflow-y-auto custom-scrollbar z-50"
    >
      <div
        class="mb-4 pb-2 flex justify-between items-center top-0 z-10 transition-shadow duration-300"
        :class="{ 'shadow-md': isHeaderShadowVisible }"
      >
        <div class="flex items-center gap-2">
          <h4 class="text-sm md:text-base font-medium text-bp_white-100">
            Pedidos de Amizade
          </h4>
        </div>
        <button
          class="hover:scale-110 transition-transform duration-300"
          @click="isNotificationMenuOpen = false"
        >
          <v-icon name="md-close" scale="1" />
        </button>
      </div>
      <ul class="flex flex-col gap-2 relative notification-container">
        <li
          v-if="notifications.length === 0"
          class="text-bp_grayscale-400 text-sm md:text-base"
        >
          Nenhum pedido {{ ":(" }}
        </li>
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="text-white mb-2 flex flex-col transition-opacity duration-500"
          :class="{ 'opacity-50': updatingNotificationId === notification.id }"
        >
          <div class="flex flex-wrap items-center gap-4">
            <div>
              <img
                v-if="notification.fromUser.imageUrl"
                :src="notification.fromUser.imageUrl"
                alt="Imagem do usuário"
                class="h-8 w-8 md:h-10 md:w-10 rounded-full"
              />
              <v-icon
                v-else
                name="md-person"
                class="text-white bg-bp_grayscale-500 rounded-full p-1"
                scale="2.5"
              />
            </div>
            <div class="flex-1">
              <p class="text-sm md:text-base text-bp_white-100">
                {{ getName(notification.fromUser.personName) }}
              </p>
              <div class="flex gap-2 ml-auto">
                <button
                  class="px-4 py-1 rounded-lg text-bp_green-500 hover:scale-[1.05] duration-300 border-bp_grayscale-500 badge bg-transparent text-xs md:text-sm"
                  @click="handleUpdateNotificationStatus(notification, 'ACCEPTED')"
                >
                  <v-icon name="fa-thumbs-up" scale="0.9" />
                </button>
                <button
                  class="px-4 py-1 rounded-lg text-red-500 hover:scale-[1.05] duration-300 border-bp_grayscale-500 badge bg-transparent text-xs md:text-sm"
                  @click="handleUpdateNotificationStatus(notification, 'REJECTED')"
                >
                  <v-icon name="fa-thumbs-down" scale="0.9" />
                </button>
              </div>
            </div>
          </div>
        </li>
        <div
          v-if="notifications.length > 0 && isHeaderShadowVisible"
          class="sticky bottom-0 left-0 w-full h-5 bg-gradient-to-t from-bp_neutral-700 to-transparent pointer-events-none"
        ></div>
      </ul>
    </div>
  </div>
</template>
