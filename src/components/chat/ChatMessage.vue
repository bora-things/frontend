<script setup>
import { computed } from 'vue'

const props = defineProps(['author', 'sentAt'])

const isMessageFromSimbora = computed(() => props.author === 'simbora')
</script>

<template>
  <div
    class="flex flex-col p-4 whitespace-pre-wrap"
    :class="{ 'items-start': isMessageFromSimbora, 'items-end': !isMessageFromSimbora }"
  >
    <div
      class="flex gap-3 items-start"
      :class="{ 'flex-row-reverse': !isMessageFromSimbora }"
    >
      <div class="relative">
        <v-icon
          v-if="isMessageFromSimbora"
          name="bi-caret-left-fill"
          scale="1.8"
          class="absolute -rotate-90 -top-3 -left-1 text-green-600"
        />

        <v-icon
          v-if="!isMessageFromSimbora"
          name="bi-caret-right-fill"
          scale="1.8"
          class="absolute rotate-90 -top-3 -right-1 text-bp_neutral-700"
        />

        <div
          class="p-2 max-w-xs text-sm text-white font-bold"
          :class="{
            'bg-green-600 rounded-r-md rounded-b-md ml-3': isMessageFromSimbora,
            'bg-bp_neutral-700 rounded-l-md rounded-b-md mr-3': !isMessageFromSimbora,
          }"
        >
          <div class="flex flex-col">
            <slot />
            <span
              class="text-[10px] text-gray-300 font-normal ml-auto mt-1 self-end"
              >{{ props.sentAt }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>