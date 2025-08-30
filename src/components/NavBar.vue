<script setup>
import api from "@/config/axios.config";
import router from "@/router";
import { capitalizeText } from "@/utils/capitalizeText.js";
import { onMounted, ref } from "vue";
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
    <img
      class="w-16 h-auto cursor-pointer"
      src="/public/images/simbora.svg"
      @click="router.push('/dashboard')"
      alt="Logo do Simbora"
    />

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

        <div className="dropdown dropdown-end">
          <div tabIndex="{0}" role="button" className="rounded-field ">
            <img
              v-if="user && user.image_url"
              :src="user.image_url"
              @error="user.image_url = null"
              alt="Foto do usuário"
              class="h-16 w-16 rounded-full object-cover"
            />
            <div v-else class="w-16 h-16 rounded-full flex items-center justify-center">
              <v-icon name="io-person-circle-sharp" class="text-white w-14 h-14" />
            </div>
          </div>
          <ul
            tabIndex="{0}"
            className="menu dropdown-content bg-bp_neutral-700 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li><a :href="`/perfil/${user ? user.id : 0}`">Perfil</a></li>
            <li><a href="/amigos">Amigos</a></li>
            <li>
              <a @click="handleLogout" class="relative w-full">
                <v-icon name="md-logout" class="w-5 h-5 mr-2 absolute text-red-500" />

                Sair</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
