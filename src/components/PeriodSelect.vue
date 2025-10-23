<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  periods: Array,
  selectedPeriod: String,
});

defineEmits(["select-period"]);

const getPeriodClasses = (period) => {
  const isSelected = props.selectedPeriod === `${period.ano}-${period.periodo}`;

  return {
    'bg-bp_green-600 border-bp_green-600 text-white shadow-lg': isSelected,
    'border-r-4 border-r-bp_green-100/50 bg-bp_grayscale-700 border-bp_grayscale-600 hover:bg-bp_grayscale-600 hover:border-bp_grayscale-500': !isSelected && !period.interest,
    'border-2 border-dashed border-bp_green-600 hover:bg-bp_grayscale-700 hover:text-white transition-colors duration-200': period.interest && !isSelected,
  };
};
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <button
      v-for="(period, index) in periods"
      :key="index"
      class="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors duration-200 min-w-[120px]"
      :class="getPeriodClasses(period)"
      @click="$emit('select-period', `${period.ano}-${period.periodo}`)"
    >
      <span class="font-bold leading-tight">{{ index + 1 }}º Período</span>
      <span class="text-sm leading-tight">{{ period.ano }}.{{ period.periodo }}</span>
    </button>

    <button
      class="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-bp_grayscale-500 text-bp_grayscale-300 hover:bg-bp_grayscale-700 hover:text-white transition-colors duration-200 min-w-[120px] h-[65px]"
      @click="$emit('select-period', 'new')"
    >
      <v-icon name="bi-plus-lg" scale="1.1" />
      <span class="font-bold leading-tight">Novo</span>
    </button>
  </div>
</template>