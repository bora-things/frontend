<script setup>
import { computed } from 'vue'

const props = defineProps(['type', 'size'])

const sizes = {
  small: 'px-2 h-10',
  medium: 'px-4 h-12',
  large: 'px-4 h-16'
}

const types = {
  primary:
    'disabled:bg-[#E2E2E2] bg-bp_primary-400 hover:bg-bp_primary-600 active:bg-bp_primary-800 disabled:cursor-default disabled:bg-[#E2E2E2] disabled:text-[#ABABAB]',
  green:
    'disabled:bg-[#E2E2E2] bg-bp_green-400 hover:bg-bp_green-500 active:bg-bp_green-500 disabled:cursor-default disabled:bg-[#E2E2E2] disabled:text-[#ABABAB]',
  outlined:
    'disabled:bg-[#E2E2E2] border border-bp_primary-400 text-bp_primary-400 hover:bg-bp_primary-400 hover:text-bp_neutral-50 active:bg-bp_primary-700 disabled:border-0',
  text: 'bg-opacity-0 bg-bp_primary-400 text-bp_primary-400 hover:bg-opacity-10 active:bg-bp_primary-400 active:text-bp_neutral-50'
}

const bntSizeClass = computed(() => {
  return sizes[props.size] || sizes['medium']
})

const bntTypeClass = computed(() => {
  return types[props.type] || types['primary']
})
</script>

<template>
  <button
    class="flex items-center justify-center gap-4 rounded-md font-semibold cursor-pointer duration-200 disabled:text-[#ABABAB]"
    :class="[bntSizeClass, bntTypeClass]"
  >
    <slot />
  </button>
</template>
