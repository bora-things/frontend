<template>
  <div class="flex flex-col items-start">
    <div class="flex flex-col">
      <div class="dropdown dropdown-hover">
        <div tabindex="0" role="button" class="m-1 title-h1 p-0 flex items-center gap-2">
          {{
            periods.findIndex(
              (item) =>
                item.ano == selectedPeriod.split("-")[0] &&
                item.periodo == selectedPeriod.split("-")[1]
            ) + 1
          }}º Período
          <v-icon name="bi-chevron-down" scale="1.2"></v-icon>
        </div>
        <ul
          tabindex="0"
          class="title-h2 dropdown-content menu bg-bp_grayscale-700 rounded-box z-1 w-52 p-2 shadow-xl gap-1"
        >
          <li
            v-for="(period, index) in periods"
            :key="index"
            :class="[
              'hover:bg-bp_grayscale-800 p-2 rounded-md cursor-pointer',
              selectedPeriod == `${period.ano}-${period.periodo}`
                ? 'bg-bp_grayscale-800'
                : '',
              period.interest
                ? 'border-r-2 border-bp_green-100/30 rounded-r-none hover:bg-bp_green-500/10 duration-300'
                : '',
            ]"
            @click="$emit('select-period', `${period.ano}-${period.periodo}`)"
          >
            {{ index + 1 }}º Período
          </li>
          <li
            class="hover:bg-bp_grayscale-700 p-2 rounded-md cursor-pointer"
            @click="$emit('select-period', 'new')"
          >
            Novo Período
          </li>
        </ul>
      </div>
    </div>
    <span class="font-sans text-vtd-secondary-100">
      {{ selectedPeriod.replace("-", ".") }}
    </span>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
const props = defineProps({
  periods: Array,
  selectedPeriod: String,
});
const emit = defineEmits(["select-period"]);
</script>
