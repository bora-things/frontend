<script setup>
import { ref } from 'vue'

const isExpanded = ref(false)

const props = defineProps(['period'])

function toggleExpansion() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <article class="w-full">
    <div
      class="rounded-t-md rounded-b-md bg-bp_neutral-700 cursor-pointer flex items-center justify-between p-6 border-bp_neutral-600"
      :class="{ 'border-b rounded-b-none': isExpanded }"
      @click="toggleExpansion"
    >
      <h3 class="font-bold text-2xl">{{ period.periodNumber }}º - {{period.schoolYear  }}</h3>
      <div class="flex items-center gap-4">
        <span class="font-bold border border-bp_neutral-600 px-2 py-1 rounded-3xl">
          <v-icon name="md-schedule" />
          {{ period.subjects?.reduce((acc, subject) => acc + subject.workload, 0) }}h
        </span>
        <v-icon
          name="md-keyboardarrowleft"
          scale="1.5"
          class="transition-transform"
          :class="{ '-rotate-90': isExpanded }"
        />
      </div>
    </div>

    <div
      class="rounded-b-md bg-bp_neutral-700 flex flex-col gap-4 h-min overflow-hidden transition-[max-height] duration-200 ease-in-out"
      :class="{ 'max-h-0': !isExpanded, 'max-h-[40rem]': isExpanded }"
    >
      <ul class="flex flex-col gap-4 mt-2 m-4">
        <li
          v-for="subject in period.subjects"
          :key="subject.code"
          :class="subject.type==='Obrigatória'? 'border-blue-500' : 'border-bp_yellow-100'"
          class="flex items-center justify-between gap-4 border  rounded-md px-4 py-2"
        >
          <p class="font-bold">{{ subject.name }} ({{ subject.workload }}h) - {{ subject.code }}</p>
          <button class="cursor-pointer">
            <v-icon name="md-infooutline" />
          </button>
        </li>
      </ul>
    </div>
  </article>
</template>