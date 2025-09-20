<script setup>
import NavBar from "@/components/NavBar.vue";
import SimboraChat from "@/components/chat/SimboraChat.vue";
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

const route = useRoute();
const showComponents = ref(route.path !== "/" && route.path !== "/acesso-negado");

watch(route, (newRoute) => {
  showComponents.value = newRoute.path !== "/" && newRoute.path !== "/acesso-negado";
});
</script>

<template>
  <div class="min-h-screen flex flex-col h-full bg-bp_neutral-800 text-bp_neutral-50">
    <NavBar v-if="showComponents" />
    <main class="flex-1 flex flex-col">
      <SimboraChat />
      <RouterView />
    </main>
  </div>
</template>
