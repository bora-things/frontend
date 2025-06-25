<script setup>
import api from "@/config/axios.config";
import { capitalizeText } from "@/utils/capitalizeText.js";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import CardAd from "./CardAd.vue";
import NotificationMenu from "./NotificationMenu.vue";
import PersonalizedCalendar from "./PersonalizedCalendar.vue";

const isMenuOpen = ref(false);

function handleMenuClick() {
  isMenuOpen.value = !isMenuOpen.value;
}

async function handleLogout() {
  const logoutLink = import.meta.env.VITE_API_URL + "/logout";
  window.location.href = logoutLink;
}

const user = ref(null);

async function fetchUser() {
  try {
    const response = await api.get("/api/students/me");
    const data = await response.data;
    user.value = data;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
}

const greeting = ref("");

function setGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    greeting.value = "Bom dia";
  } else if (hour >= 12 && hour < 18) {
    greeting.value = "Boa tarde";
  } else {
    greeting.value = "Boa noite";
  }
}

onMounted(() => {
  fetchUser();
  setGreeting();
});
</script>

<template>
  <header
    class="w-full h-auto flex items-center p-6 border-b border-bp_neutral-900 gap-2 z-[1000]"
  >
    <button
      class="btn btn-ghost text-bp_neutral-400 w-11 h-11 flex items-center justify-center bg-transparent border border-bp_neutral-600 rounded-md"
      @click="handleMenuClick"
    >
      <v-icon name="md-menu-round" scale="1.5" />
    </button>

    <div class="flex justify-between items-center w-full xl:max-w-7xl mx-auto pr-8">
      <div class="flex gap-4 items-center">
        <h4 class="text-2xl font-bold font-sans">
          {{ greeting }}, {{ user ? capitalizeText(user.name.split(" ")[0]) : "" }}!
        </h4>
      </div>

      <div class="flex items-center md:gap-5">
        <div>
          <button
            class="group flex items-center bg-bp_neutral-800 border-2 border-bp_green-500 rounded-lg py-1 px-2 transition-all duration-300 shadow-bp_green-500/30 hover:shadow-[0_0_16px_4px_#22c55e] hover:border-bp_green-100 focus:outline-none focus:ring-2 focus:ring-bp_green-400"
            style="box-shadow: 0 0 0 0 #22c55e"
          >
            <v-icon
              name="bi-stars"
              scale="1.2"
              class="group-hover:animate-twinkle cursor-pointer"
            ></v-icon>
            <span class="">Fale com o Simbora</span>
          </button>
        </div>
        <div class="relative z-50">
          <div class="flex px-4 py-2 rounded-3xl gap-2 items-center">
            <CardAd />
            <NotificationMenu />
            <PersonalizedCalendar />
          </div>
        </div>

        <div>
          <img
            v-if="user && user.image_url"
            :src="user.image_url"
            alt="Foto do usuário"
            class="h-16 w-16 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
    <nav
      class="w-11/12 md:w-auto bg-bp_grayscale-800 z-[99] border-r-2 border-bp_neutral-700 fixed top-0 h-full transition-all ease-in-out duration-300"
      :class="{
        '-left-full': !isMenuOpen,
        'left-0': isMenuOpen,
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
                class="h-16 w-16 rounded-full object-cover"
              />
              <div
                v-else
                class="bg-bp_neutral-600 rounded-full flex items-center justify-center w-12 h-12"
              >
                <v-icon name="fa-user-alt" class="text-white text-4xl" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-lg leading-none">{{
                  capitalizeText(user.name)
                }}</span>
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
  </header>
</template>
