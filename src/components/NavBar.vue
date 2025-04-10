<script setup>
import BadgeTag from '@/components/BadgeTag.vue'
import { LoadingOutlined, UserOutlined, DoubleLeftOutlined } from '@ant-design/icons-vue'
import { useLogout } from '@/services/useLogout'
import { Button } from 'ant-design-vue'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useUser } from '@/services/useUser.js'
import NotificationMenu from './NotificationMenu.vue'
import { capitalizeText } from '@/utils/capitalizeText.js'
const isMenuOpen = ref(false)

function handleMenuClick() {
  isMenuOpen.value = !isMenuOpen.value
}
const { user, fetchUser } = useUser()
const { handleLogout } = useLogout()

</script>

<template>
  <header
    class="w-full h-auto flex justify-between items-center p-6 border-b border-bp_neutral-700"
  >
    <div class="flex items-center gap-10">
      <Button
        class="text-bp_neutral-400 w-11 h-11 flex items-center justify-center bg-transparent border border-bp_neutral-700 rounded-md"
        @click="handleMenuClick"
      >
        <v-icon name="md-menu-round" scale="1.5" />
      </Button>
      <div class="flex gap-4 items-center">
        <h4 class="text-xl font-bold">Bora Pagar</h4>
      </div>
    </div>
    <nav
      class="w-11/12 md:w-auto bg-neutral-950 z-[99] border-r-2 border-bp_neutral-700 fixed top-0 h-full transition-all ease-in-out duration-300"
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
          <DoubleLeftOutlined />
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
                <UserOutlined class="text-white text-4xl" />
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
            <a-badge class="bg-bp_neutral-700 p-2 text-white rounded-lg">{{
              capitalizeText(user.course_name)
            }}</a-badge>
            <a-badge class="bg-bp_neutral-700 p-2 text-white rounded-lg"
              >{{ user.period }}º Período</a-badge
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
