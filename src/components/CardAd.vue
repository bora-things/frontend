<script setup>
import { onMounted, ref } from "vue";

const isCardAdOpen = ref(false);

function handleCardAdClick() {
  isCardAdOpen.value = !isCardAdOpen.value;
}

const advertisements = ref([]);

async function fetchAdvertisements() {
  try {
    const response = await fetch("/src/assets/mocks/AdvertisementsMockData.json");
    const data = await response.json();
    advertisements.value = data;
  } catch (error) {
    console.error("Error fetching anuncios:", error);
  }
}

onMounted(() => {
  fetchAdvertisements();
});
</script>

<template>
  <div class="flex justify-end">
    <button
      class="relative bg-bp_grayscale-800 border border-bp_neutral-600 rounded-full w-12 h-12"
      @click="handleCardAdClick"
    >
      <div
        v-if="advertisements.length > 0"
        class="top-1 right-0 w-3 h-3 bg-bp_green-100 absolute rounded-full"
      ></div>
      <v-icon class="p-1" name="md-notificationsnone-outlined" scale="1.8"></v-icon>
    </button>
    <div
      v-if="isCardAdOpen"
      class="absolute right-3 bg-bp_grayscale-800 p-4 rounded-md shadow-lg transition-all ease-in-out duration-300 w-[90%] md:w-96 max-h-[70vh] overflow-y-auto custom-scrollbar z-50"
    >
      <header class="flex justify-between items-center mb-4">
        <p class="title-h1">Anúncios</p>
        <button @click="isCardAdOpen = false">
          <v-icon name="md-close" scale="1" />
        </button>
      </header>

      <ul class="flex flex-col gap-2">
        <li v-if="advertisements.length === 0" class="text-white text-sm md:text-base">
          Nenhum anuncio
        </li>
        <li
          v-for="advertisement in advertisements"
          :key="advertisement.id"
          class="text-white mb-2 flex flex-col"
        >
          <div class="flex items-center gap-3">
            <div class="bg-bp_neutral-900 rounded-xl p-2">
              <v-icon name="md-notificationsnone-outlined" scale="1.5"></v-icon>
            </div>
            <div>
              <p>{{ advertisement.title }}</p>
              <span class="text-sm text-bp_neutral-500">{{
                advertisement.description
              }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
