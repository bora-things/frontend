<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']); 

const placeholder = defineProps({
  placeholder: {
    type: String,
    default: 'Pesquisar', // Set a default value to avoid issues
  },
});

const handleSearch = () => {
  console.log('Buscando:', searchQuery.value);
  emit('search', searchQuery.value);
};

</script>
<template>
  <div class="flex justify-between items-center border border-bp_neutral-700 rounded-full overflow-hidden bg-bp_neutral-800">
    <input
      type="text"
      v-model="searchQuery"
      class="flex py-2 pl-6 bg-transparent text-bp_neutral-500"
      :placeholder="placeholder.placeholder"
    />
    <button 
      @click="handleSearch"
      class="text-bp_primary-50 px-4 py-2">
      <v-icon name="md-search" scale="1.5" />
    </button>
  </div>
</template>

