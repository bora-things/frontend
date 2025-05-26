<script setup>
import NavBar from "@/components/NavBar.vue";
import SimboraChat from "@/components/chat/SimboraChat.vue";
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

const route = useRoute();
const showComponents = ref(route.path !== "/");

watch(route, (newRoute) => {
  showComponents.value = newRoute.path !== "/";
});
</script>

<template>
  <div class="min-h-screen h-full bg-bp_neutral-800 text-bp_neutral-50 flex flex-col">
    <NavBar v-if="showComponents" />
    <SimboraChat />
    <RouterView />
  </div>
</template>
