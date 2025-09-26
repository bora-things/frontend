<script setup>

const props = defineProps(['friend'])
const { id, name, degree, period, is_friend } = props.friend

</script>

<template>
  <a
    :href="`/perfil/${id}`"
    class="border border-bp_grayscale-500 hover:border-bp_green-400 user-container bg-bp_neutral-800 rounded-xl h-28 text-white flex justify-between items-center px-2 md:px-6 transition-colors duration-500 ease-in-out"
  >
    <div class="flex items-center gap-3">
      <img
        class="rounded-full w-[73px] h-[73px]"
        src="https://images.pexels.com/photos/21085439/pexels-photo-21085439/free-photo-of-preto-e-branco-p-b-olhando-vendo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="foto do amigo"
      />
      <div>
        <div class="text-xl font-bold pb-2">{{ name }}</div>
        <div class="flex  flex-wrap gap-2">
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

    <div v-if="!is_friend" class="flex items-center">
      <button class="bg-bp_green-400 hover:bg-bp_green-600 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out"><v-icon name="md-personaddalt-round" scale="1.2"/>  Adicionar</button>
    </div>

    <div v-if="is_friend" class="flex items-center">
      <button class="border-2 border-bp_grayscale-500 hover:bg-bp_grayscale-500 font-bold px-3 py-2 rounded-md transition-colors duration-500 ease-in-out"><v-icon name="md-personremove-round"/>  Remover</button>
    </div>
  </a>
</template>