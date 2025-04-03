<script lang="ts" setup>
import { useClassData } from '@/composables/useClassData'
import { ref } from 'vue'

const props = defineProps(['classDataProps'])
const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const { classData } = useClassData({ id: props.classDataProps.id })
</script>

<template>
  <v-icon name="md-infooutline" @click="showModal" />
  <a-modal
    v-model:open="open"
    width="50%"
    class="rounded-lg shadow-lg border border-white"
    closable="false"
    footer=""
  >
    
    <div class="flex flex-col gap-4 p-6 bg-bp_neutral-800">
      <h2 class="title-h2">{{ classData.name }}</h2>
      <p><strong>Código:</strong> {{ classData.code }}</p>
      <p><strong>Professor:</strong> {{ classData.teacher }}</p>
      <p><strong>Horário:</strong> {{ classData.time }}</p>
      <p><strong>Carga Horária:</strong> {{ classData.workload }} horas</p>
      <p><strong>Obrigatória:</strong> {{ classData.mandatory ? 'Sim' : 'Não' }}</p>
      <p><strong>Quantidade de Alunos:</strong> {{ classData.studentCount }}</p>
      <p><strong>Status:</strong> {{ classData.status }}</p>
      <p><strong>Ementa:</strong> {{ classData.syllabus }}</p>
      <p v-if="classData.finalGrade !== null">
        <strong>Nota Final:</strong> {{ classData.finalGrade }}
      </p>
    </div>
  </a-modal>
</template>
