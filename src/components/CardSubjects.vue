<script setup>
import { computed } from 'vue'
import BpButton from './BpButton.vue'

const props = defineProps(['subject']);
const { code, workload, name, department, course, difficulty } = props.subject;

const difficultyClass = computed(() => {
  switch (difficulty) {
    case 'ALTA':
      return 'bg-bp_danger'
    case 'MEDIA':
      return 'bg-bp_yellow-100'
    case 'BAIXA':
      return 'bg-bp_green-400'
    default:
      return 'bg-bp_neutral-200'
  }
})
</script>

<template>
  <div class="md:flex items-center justify-between text-bp_neutral-50 w-full lg:h-24 rounded-lg bg-bp_neutral-800 p-2 md:p-4">
    <div class="flex items-center space-x-3 md:space-x-6">
      <div class="flex flex-col items-center">
        <p class="text-xl md:text-2xl font-semibold">{{ code }}</p>
        <p class="text-md md:text-xl">{{ workload }}h</p>
      </div>
      <div class="block w-0.5 h-24 bg-bp_neutral-700"></div>
        <div class="flex justify-between items-center w-full">
          <div class="">
            <div class="flex items-center space-x-2 lg:space-x-4">
            <p class="text-base sm:text-lg font-semibold">{{ name }}</p>
            <div :class="difficultyClass" class="w-4 h-4 sm:w-5 sm:h-5 rounded-full"></div>
          </div>
          <div class="flex items-center space-x-2 lg:space-x-4">
            <p class="md:text-2xl sm:text-base">{{ department }}</p>
            <p>|</p>
            <p class="md:text-2xl sm:text-base">{{ course }}</p>
          </div>
        </div>
      </div>
    </div>
    <BpButton class="w-full md:w-1/6 mt-2" size="small" type="outlined"> Detalhes </BpButton>
  </div>
</template>
