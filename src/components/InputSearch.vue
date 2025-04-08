<script setup>
import { ref } from 'vue';
import InputBase from './InputBase.vue'

const searchQuery = ref('');
const emit = defineEmits(['search']); 

const handleSearch = () => {
  console.log('Buscando:', searchQuery.value);
  emit('search', searchQuery.value);
};

</script>
<template>
  <div class="flex">
    <input
      type="text"
      v-model="searchQuery"
      class="w-full bg-bp_neutral-800 border border-bp_neutral-700 rounded-l-lg py-2 px-4 text-bp_neutral-500"
      placeholder="pré requisito de fmciii |"
    />
    <button 
    @click="handleSearch"
    class="bg-bp_primary-300 text-bp_primary-50 rounded-r-lg py-2 px-4">
      <v-icon name="md-search" scale="1.5" />
    </button>
  </div>
</template>
