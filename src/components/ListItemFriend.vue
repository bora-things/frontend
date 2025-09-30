<script setup>
const props = defineProps(['friend'])
const { id, name, degree, period, friendship_status } = props.friend
</script>

<template>
  <a
    :href="`/perfil/${id}`"
    class="border border-bp_grayscale-500 hover:border-bp_green-400 user-container bg-bp_neutral-800 rounded-xl text-white flex flex-col items-start md:flex-row md:items-center md:justify-between p-4 md:px-6 h-auto md:h-32 transition-colors duration-500 ease-in-out gap-4 md:gap-0"
  >
    <div class="flex items-center gap-3">
      <img
        class="rounded-full w-14 h-14 md:w-[73px] md:h-[73px] transition-all"
        src="https://images.pexels.com/photos/21085439/pexels-photo-21085439/free-photo-of-preto-e-branco-p-b-olhando-vendo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="foto do amigo"
      />
      <div>
        <div class="text-lg md:text-xl font-bold pb-1 md:pb-2">{{ name }}</div>
        <div class="grid grid-cols-1 space-y-1 text-sm">
          <span class="inline-flex items-center gap-1">
            <v-icon class="text-bp_green-400" name="md-school-outlined"></v-icon>
            {{ degree }}
          </span>
          <span class="inline-flex items-center gap-1">
            <v-icon class="text-bp_green-400" name="md-calendartoday-outlined"></v-icon>
            Período {{ period }}°
          </span>
        </div>
      </div>
    </div>

    <div class="w-full md:w-auto">
      <div v-if="friendship_status == 'not_friends'" class="flex">
        <button
          class="bg-bp_green-400 hover:bg-bp_green-600 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <v-icon name="md-personaddalt-round" scale="1.2" />
          <span>Adicionar</span> </button>
      </div>

      <div v-if="friendship_status == 'friends'" class="flex">
        <button
          class="border-2 border-bp_grayscale-500 hover:bg-bp_grayscale-500 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <v-icon name="md-personremove-round" />
          <span>Remover</span> </button>
      </div>

      <div v-if="friendship_status === 'pending_sent'" class="flex">
        <button
          disabled
          class="bg-bp_grayscale-600 text-bp_white-100 font-bold px-3 py-2 rounded-md cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <v-icon name="md-accesstime" />
          <span>Pendente</span> </button>
      </div>

      <div v-if="friendship_status === 'pending_received'" class="flex items-center gap-2 w-full md:w-auto">
        <button
          class="bg-bp_green-400 hover:bg-bp_green-600 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex flex-1 items-center justify-center gap-1 md:flex-none"
        >
          <v-icon name="md-check-round" />
          <span>Aceitar</span>
        </button>
        <button
          class="border border-bp_grayscale-500 hover:bg-bp_grayscale-500 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out flex flex-1 items-center justify-center gap-1 md:flex-none"
        >
          <v-icon name="md-close-round" />
          <span>Recusar</span>
        </button>
      </div>
    </div>
  </a>
</template>