<script setup>
import BadgeTag from '@/components/BadgeTag.vue'
import { useLogout } from '@/composables/useLogout'
import { Button } from 'ant-design-vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import NotificationMenu from './NotificationMenu.vue'

const isMenuOpen = ref(false)

function handleMenuClick() {
  isMenuOpen.value = !isMenuOpen.value
}
const { handleLogout } = useLogout()
</script>

<template>
  <header
    class="w-full h-auto flex justify-between items-center p-6  border-b border-bp_neutral-700"
  >
    <div class="flex items-center gap-10">
      <Button
        class="text-bp_neutral-400 w-11 h-11 flex items-center justify-center bg-transparent border border-bp_neutral-700 rounded-md"
        @click="handleMenuClick"
      >
        <v-icon name="md-menu-round" scale="1.5" />
      </Button>
      <div class="flex gap-4 items-center">
        <img
          src="https://images.pexels.com/photos/21085439/pexels-photo-21085439/free-photo-of-preto-e-branco-p-b-olhando-vendo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Simbora: o mascote do Bora Pagar"
          class="h-12 w-12 rounded-full"
        />
        <h4 class="text-xl font-bold">Bora Pagar</h4>
      </div>
    </div>
    <nav
      class="w-11/12 md:w-auto p-5 py-8 bg-neutral-950 z-[99] border-r-2 border-bp_neutral-700 fixed top-0 h-full transition-all ease-in-out duration-300"
      :class="{
        '-left-full': !isMenuOpen,
        'left-0': isMenuOpen
      }"
    >
      <div class="flex items-center justify-between">
        <div class="flex gap-3 items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-NGEQDekk2BwsllLjk4tcIM_BPIzXECdsg&s"
            alt="Foto de CR7"
            class="h-12 w-12 rounded-full"
          />
          <span class="font-bold text-lg">CR7 Jales</span>
        </div>
        <button type="button" @click="handleMenuClick">
          <v-icon name="md-close" scale="1.5" />
        </button>
      </div>
      <div class="flex items-center gap-6 text-sm mt-7">
        <BadgeTag size="large" type="primary">Tecnologia da Informação</BadgeTag>
        <BadgeTag size="large" type="primary">5º Período</BadgeTag>
      </div>

      <hr class="my-6" />

      <div class="flex flex-col gap-4">
        <RouterLink class="menu-item" to="/dashboard">
          <v-icon name="md-home-outlined" />
          <span>Home</span>
        </RouterLink>
        <RouterLink class="menu-item" to="/perfil">
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
    </nav>
      <NotificationMenu/>
  </header>
</template>
