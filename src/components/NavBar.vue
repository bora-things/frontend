<script setup>
import api from '@/config/axios.config'
import { capitalizeText } from '@/utils/capitalizeText.js'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import NotificationMenu from './NotificationMenu.vue'
import CardAd from '@/components/CardAd.vue'
import PersonalizedCalendar from '@/components/PersonalizedCalendar.vue'

const isMenuOpen = ref(false)
const isCalendarOpen = ref(false)
const isCardAdOpen = ref(false)

function handleMenuClick() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleCalendarClick() {
  isCalendarOpen.value = !isCalendarOpen.value
}

function handleCardAdClick() {
  isCardAdOpen.value = !isCardAdOpen.value
}

async function handleLogout() {
  const logoutLink = import.meta.env.VITE_API_URL + '/logout'
  window.location.href = logoutLink
}

const user = ref(null)

async function fetchUser() {
  try {
    const response = await api.get('/api/students/me') 
    const data = await response.data
    user.value = data
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <header
    class="w-full h-auto flex justify-between items-center p-6 border-b border-bp_neutral-700"
  >
  <button
        class="btn btn-ghost text-bp_neutral-400 w-11 h-11 flex items-center justify-center bg-transparent border border-bp_neutral-700 rounded-md"
        @click="handleMenuClick"
      >
        <v-icon name="md-menu-round" scale="1.5" />
      </button>
    <div class="flex justify-between items-center gap-10 rounded-xl ">
      <div class="flex gap-4 items-center">
        <h4 class="text-xl font-bold">Bora Pagar</h4>
      </div>
      <div class="bg-bp_neutral-900 px-4 py-2 rounded-3xl space-x-2">
        <v-icon class="bg-bp_neutral-800 rounded-full p-2" 
          name="md-notificationsnone-outlined" scale="1.8"
          @click="handleCardAdClick"
          ></v-icon>
        <v-icon class="bg-bp_neutral-800 rounded-full p-2" 
          name="md-groupadd-outlined" scale="1.8"
          
          ></v-icon>
        <v-icon class="bg-bp_neutral-800 rounded-full p-2" 
          name="md-calendartoday-round" scale="1.8"
          @click="handleCalendarClick"
        ></v-icon>
        <PersonalizedCalendar v-if="isCalendarOpen"/>
      </div>
    </div>
    <nav
      class="w-11/12 md:w-auto bg-bp_neutral-950 z-[99] border-r-2 border-bp_neutral-700 fixed top-0 h-full transition-all ease-in-out duration-300"
      :class="{
        '-left-full': !isMenuOpen,
        'left-0': isMenuOpen
      }"
    >
      <div class="relative p-5 py-8">
        <div
          @click="handleMenuClick"
          class="absolute top-2 text-lg right-0 translate-x-1/2 bg-white text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-bp_neutral-700 hover:text-white transition-all ease-in-out duration-300"
        >
          <v-icon name="fa-angle-double-left" scale="1.5" />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex gap-3 items-center">
            <template v-if="user">
              <img
                v-if="user.image_url"
                :src="user.image_url"
                alt=""
                class="h-12 w-12 rounded-full"
              />
              <div
                v-else
                class="bg-bp_neutral-600 rounded-full flex items-center justify-center w-12 h-12"
              >
                <v-icon name="fa-user-alt" class="text-white text-4xl" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-lg leading-none">{{ capitalizeText(user.name) }}</span>
                <span class="text-sm">{{ user.login }}</span>
              </div>
            </template>
            <template v-else>
              <div class="h-12 w-12 rounded-full bg-bp_neutral-600 animate-pulse"></div>
              <div class="h-6 w-24 bg-bp_neutral-600 animate-pulse rounded"></div>
            </template>
          </div>
        </div>
        <div class="flex items-center gap-6 text-sm mt-7">
          <template v-if="user" class="flex flex-col">
            <span class="badge bg-bp_neutral-700 p-2 text-white rounded-lg">{{
              capitalizeText(user.course_name)
            }}</span>
            <span class="badge bg-bp_neutral-700 p-2 text-white rounded-lg"
              >{{ user.period }}º Período</span
            >
          </template>
          <template v-else>
            <div class="h-6 w-32 bg-bp_neutral-600 animate-pulse rounded"></div>
            <div class="h-6 w-20 bg-bp_neutral-600 animate-pulse rounded"></div>
          </template>
        </div>

        <hr class="my-6" />

        <div class="flex flex-col gap-4">
          <RouterLink class="menu-item" to="/dashboard">
            <v-icon name="md-home-outlined" />
            <span>Home</span>
          </RouterLink>
          <RouterLink class="menu-item" :to="`/perfil/${user ? user.id : 0}`">
            <v-icon name="md-person-outlined" />
            <span>Perfil</span>
          </RouterLink>
          <RouterLink class="menu-item" to="/amigos">
            <v-icon name="md-group-outlined" />
            <span>Amigos</span>
          </RouterLink>
          <RouterLink class="menu-item" to="/disciplinas">
            <v-icon name="md-menubook-outlined" />
            <span>Disciplinas</span>
          </RouterLink>
          <RouterLink class="menu-item" to="/interesses">
            <v-icon name="md-class-outlined" />
            <span>Interesses</span>
          </RouterLink>

          <button
            class="flex items-center gap-4 mt-4 text-bp_danger border-bp_danger menu-item after:bg-bp_danger"
            @click="handleLogout"
          >
            <v-icon name="md-logout" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
    <NotificationMenu />
  </header>
</template>
