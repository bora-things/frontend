<script setup>
import NavBar from '@/components/NavBar.vue';
import SimboraChat from '@/components/chat/SimboraChat.vue';
import {useRoute, RouterView } from 'vue-router';
import {ref,watch} from 'vue';

const route=useRoute();
const showComponents = ref(route.path !== '/')

watch(route, (newRoute) => {
  showComponents.value = newRoute.path !== '/'
})

</script>

<template>
  <div class="min-h-screen h-full bg-bp_neutral-900 text-bp_neutral-50">
    <NavBar v-if="showComponents" />
    <SimboraChat v-if="showComponents"/>
    <RouterView />
  </div>
</template>
