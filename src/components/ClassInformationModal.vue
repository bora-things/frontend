<script lang="ts" setup>
import { useClassData } from '@/services/useClassData'
import { ref } from 'vue'

const props = defineProps(['classDataProps'])
const open = ref<boolean>(false)

const showModal = () => {
  open.value = true;
  fetchClassData()
}

const { classData,fetchClassData } = useClassData({ id: props.classDataProps.id })
</script>

<template>
  <v-icon name="md-infooutline" @click="showModal" />
  <a-modal
    v-model:open="open"
    width="50%"
    class="rounded-lg shadow-lg border border-white"
    footer=""
  >
    
    <div class="flex flex-col gap-4 p-6 bg-bp_neutral-800">
      <h2 class="title-h2">{{ classData?classData.name:'-' }}</h2>
      <p><strong>Código:</strong> {{ classData?classData.code:'-' }}</p>
      <p><strong>Professor:</strong> {{ classData?classData.teacher:'-' }}</p>
      <p><strong>Horário:</strong> {{ classData?classData.time:'-' }}</p>
      <p><strong>Carga Horária:</strong> {{ classData?classData.workload:'-' }} horas</p>
      <p><strong>Obrigatória:</strong> {{ classData?classData.mandatory ? 'Sim' : 'Não':'-' }}</p>
      <p><strong>Quantidade de Alunos:</strong> {{ classData?classData.studentCount:'-' }}</p>
      <p><strong>Status:</strong> {{ classData?classData.status:'-' }}</p>
      <p><strong>Ementa:</strong> {{ classData?classData.syllabus:'-' }}</p>
      <p v-if="classData && classData.finalGrade !== null">
        <strong>Nota Final:</strong> {{ classData.finalGrade }}
      </p>
    </div>
  </a-modal>
</template>
