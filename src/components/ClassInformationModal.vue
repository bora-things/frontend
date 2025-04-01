<script lang="ts" setup>
import { ref } from 'vue'


const props=defineProps(["classId"])
const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}
</script>

<template>
  <div>
    <v-icon name="md-infooutline" @click="showModal" />
    <a-modal v-model:visible="open" title="Informações da Turma" >
      <h1></h1>
      
      
    </a-modal>
  </div>
</template>
