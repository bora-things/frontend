<script setup>
import { computed, defineEmits, toRef } from "vue";

const props = defineProps(["current", "count", "onchange"]);
const _current = toRef(props, "current");
const _count = toRef(props, "count");
const emit = defineEmits(["changeCurrentValue"]);

function add() {
  if (_current.value < _count.value - 1) {
    console.log("Próxima página:", _current.value + 1);
    emit("changeCurrentValue", _current.value + 1);
  }
}
function back() {
  if (_current.value > 0) {
    console.log("Página anterior:", _current.value - 1);
    emit("changeCurrentValue", _current.value - 1);
  }
}

function handleClick(event) {
  const content = event.target.textContent.trim();
  const pageNumber = parseInt(content) - 1;
  if (pageNumber >= 0 && pageNumber < _count.value) {
    console.log("Página clicada:", pageNumber);
    emit("changeCurrentValue", pageNumber);
  }
}

// Criar array de páginas visíveis baseado na página atual e total de páginas
const visiblePages = computed(() => {
  const current = _current.value;
  const total = _count.value;
  const maxVisible = 5;

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index);
  }

  let start = Math.max(0, current - Math.floor(maxVisible / 2));
  let end = Math.min(total, start + maxVisible);

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  return Array.from({ length: end - start }, (_, index) => start + index);
});
</script>

<template>
  <nav>
    <ul
      class="flex flex-nowrap bg-bp_neutral-900 text-bp_neutral-50"
      @click="handleClick"
    >
      <li>
        <button
          type="button"
          class="btn btn-ghost hover:bg-transparent hover:border-none text-white mr-2"
          @click.stop="back"
          :disabled="_current === 0"
          :class="{ 'opacity-50 cursor-not-allowed': _current === 0 }"
        >
          <v-icon name="md-arrowbackios-outlined" scale="1.1"></v-icon>
        </button>
      </li>

      <li v-for="pageIndex in visiblePages" :key="pageIndex">
        <button
          type="button"
          class="btn btn-ghost hover:bg-transparent hover:border-none text-white px-3"
          :class="{
            'text-2xl transition-all duration-500 !text-bp_primary-200 pb-2':
              _current === pageIndex,
          }"
        >
          {{ pageIndex + 1 }}
        </button>
      </li>

      <li>
        <button
          type="button"
          class="btn btn-ghost hover:bg-transparent hover:border-none text-white ml-2"
          @click.stop="add"
          :disabled="_current >= _count - 1"
          :class="{ 'opacity-50 cursor-not-allowed': _current >= _count - 1 }"
        >
          <v-icon name="md-arrowforwardios-outlined" scale="1.1"></v-icon>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped></style>
