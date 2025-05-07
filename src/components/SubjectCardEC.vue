<script setup>
const props = defineProps(['component'])

</script>

<template>
  <div class="bg-[#020202] w-full rounded-md flex flex-col gap-6 p-4 text-vtd-secondary-100">
    <p>{{ component.nome }}</p>
    <div class="flex justify-between items-end self-end">
      <div class="flex flex-col gap-2 items-end font-medium">
        <span class="badge bg-transparent border text-vtd-secondary-100">{{
          component.codigo
        }}</span>
        <div class="flex gap-2">
          <span
            :class="[
              'badge border-none text-vtd-secondary-100',
              component.obrigatoria ? 'bg-bp_green-600' : 'bg-sky-600'
            ]"
            >{{ component.obrigatoria ? 'OBRIGATÓRIO' : 'OPTATIVO' }}</span
          >
          <span class="badge bg-transparent border text-vtd-secondary-100"
            >{{ component['carga-horaria-total'] }}h</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
