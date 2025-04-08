<script setup>
import BadgeTag from './BadgeTag.vue';

const props = defineProps(['friend']);
const { id, name, degree, period } = props.friend;

</script>

<template>
  <a
    :href="`/perfil/${id}`"
    class="hover:bg-bp_neutral-600 user-container bg-bp_neutral-700 rounded-lg h-28 text-white flex justify-between items-center px-2 md:px-6"
  >
    <div class="flex justify-between items-center gap-3">
      <img
        class="rounded-full w-[73px] h-[73px]"
        src="https://images.pexels.com/photos/21085439/pexels-photo-21085439/free-photo-of-preto-e-branco-p-b-olhando-vendo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        alt="foto do amigo"
      />
      <div class="user-data ">
        <div class="text-xl font-bold pb-2">{{ name }}</div>
        <div class="flex gap-2">
          <span class="inline-flex items-center gap-1">
            <v-icon class="text-bp_primary-100" name="md-school-outlined"></v-icon>
            {{ degree }}</span
          >
          <span class="inline-flex items-center gap-1">
            <v-icon class="text-bp_primary-100" name="md-calendartoday-outlined"></v-icon> Período
            {{ period }}°</span
          >
        </div>
      </div>
    </div>

    <BadgeTag type="secondary" size="small">8 minutos atrás</BadgeTag>
  </a>
</template>
