<script setup>
import { computed } from 'vue'

const props = defineProps(['type', 'size'])

const sizes = {
  small: 'h-10 w-10',
  medium: 'w-12 h-12',
  large: 'h-16 w-16'
}

const sizeClass = computed(() => {
  return sizes[props.size] || sizes['medium']
})
</script>

<template>
  <img
    src="/public/images/simbora.svg"
    alt="Simbora: o mascote do Bora Pagar"
    :class="sizeClass"
    class=""
  />
</template>
