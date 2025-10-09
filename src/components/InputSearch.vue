<script setup>
import { computed } from "vue";

const emit = defineEmits(["search", "update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Pesquisar",
  },
});

// Computed para implementar v-model corretamente
const searchQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleSearch = () => {
  emit("search", searchQuery.value);
};
</script>
<template>
  <div
    class="flex justify-between items-center border border-bp_neutral-700 rounded-full overflow-hidden bg-bp_neutral-800 focus-within:border-gray-400 transition-colors duration-500 ease-in-out"
  >
    <input
      type="text"
      v-model="searchQuery"
      class="flex py-2 pl-6 bg-transparent text-bp_neutral-500 w-full focus:outline-none"
      :placeholder="placeholder"
    />
    <button @click="handleSearch" class="text-bp_primary-50 px-4 py-2">
      <v-icon name="md-search" scale="1.5" />
    </button>
  </div>
</template>
