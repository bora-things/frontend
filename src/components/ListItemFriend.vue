<script setup>
import UserImage from "./UserImage.vue";

const props = defineProps(["friend"]);
const { id, nome, curso, periodo, status } = props.friend;
</script>

<template>
  <a
    :href="`/perfil/${id}`"
    class="border border-bp_grayscale-500 hover:border-bp_green-400 user-container bg-bp_neutral-800 rounded-xl text-white flex flex-col items-start md:flex-row md:items-center md:justify-between p-4 md:px-6 h-auto md:h-32 transition-colors duration-500 ease-in-out gap-4 md:gap-0"
  >
    <div class="flex items-center gap-3">
      <UserImage :full-name="nome" />
      <div>
        <div class="text-lg md:text-xl font-bold pb-1 md:pb-2">{{ nome }}</div>
        <div class="grid grid-cols-1 space-y-1 text-sm">
          <span class="inline-flex items-center gap-1">
            <v-icon class="text-bp_green-400" nome="md-school-outlined"></v-icon>
            {{ curso }}
          </span>
          <span class="inline-flex items-center gap-1">
            <v-icon class="text-bp_green-400" nome="md-calendartoday-outlined"></v-icon>
            Período {{ periodo }}°
          </span>
        </div>
      </div>
    </div>

    <div class="w-full md:w-auto">
      <div v-if="status == 'not_friends'" class="flex">
        <button
          class="bg-bp_green-400 hover:bg-bp_green-600 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <v-icon nome="md-personaddalt-round" scale="1.2" />
          <span>Adicionar</span>
        </button>
      </div>

      <div v-if="status == 'friends'" class="flex">
        <button
          class="border-2 border-bp_grayscale-500 hover:bg-bp_grayscale-500 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <v-icon nome="md-personremove-round" />
          <span>Remover</span>
        </button>
      </div>

      <div v-if="status === 'pending_sent'" class="flex">
        <button
          disabled
          class="bg-bp_grayscale-600 text-bp_white-100 font-bold px-3 py-2 rounded-md cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <v-icon nome="md-accesstime" />
          <span>Pendente</span>
        </button>
      </div>

      <div
        v-if="status === 'pending_received'"
        class="flex items-center gap-2 w-full md:w-auto"
      >
        <button
          class="bg-bp_green-400 hover:bg-bp_green-600 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex flex-1 items-center justify-center gap-1 md:flex-none"
        >
          <v-icon nome="md-check-round" />
          <span>Aceitar</span>
        </button>
        <button
          class="border border-bp_grayscale-500 hover:bg-bp_grayscale-500 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex flex-1 items-center justify-center gap-1 md:flex-none"
        >
          <v-icon nome="md-close-round" />
          <span>Recusar</span>
        </button>
      </div>
    </div>
  </a>
</template>
