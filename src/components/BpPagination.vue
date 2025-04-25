<script setup>
import { toRef, defineEmits } from 'vue'
import { computed } from 'vue'

const props = defineProps(['current', 'count', 'onchange'])
const _current = toRef(props, 'current')
const emit = defineEmits(['changeCurrentValue'])

function add() {
  if (_current.value < 4) {
    emit('changeCurrentValue', _current.value + 1)
  }
}
function back() {
  if (_current.value > 0) emit('changeCurrentValue', _current.value - 1)
}

function handleClick(event) {
  const content = event.target.textContent.trim()
  emit('changeCurrentValue', parseInt(content) - 1)
  console.log(_current.value)
}

function createArray(length) {
  return Array.from({ length }, (_, index) => index)
}

const totalPages = computed(() => {
  return Math.ceil(filteredFriends.value.length / 10)
})
</script>

<template>
  <nav>
    <ul class="flex flex-nowrap bg-bp_neutral-900 text-bp_neutral-50" @click="handleClick">
      <li>
        <button type="text" class="btn btn-ghost hover:bg-transparent hover:border-none text-white mr-2" @click.stop="back">
          <v-icon name="md-arrowbackios-outlined" scale="1.1"></v-icon>
        </button>
      </li>

      <li v-for="index in createArray(5)" :key="index">
        <button
          type="text"
          class="btn btn-ghost hover:bg-transparent hover:border-none  text-white"
          :class="{
            'text-2xl transition-all duration-500 !text-bp_primary-200 pb-2':
              _current === index
          }"
        >
          {{ index + 1 }}
        </button>
      </li>

      <li>
        <button type="text" class="btn btn-ghost hover:bg-transparent hover:border-none text-white ml-2" @click.stop="add">
          <v-icon name="md-arrowforwardios-outlined" scale="1.1"></v-icon>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
