<script setup>
import { Card } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { getDefaultSubjects } from './InterestedSubjectsController'

const subjects = ref([])

onMounted(async () => {
  const subjectsData = await getDefaultSubjects()
  subjects.value = groupBySemester(subjectsData)
})

function groupBySemester(subjects) {
  return subjects.reduce((acc, subject) => {
    const semester = subject.semestre
    if (!acc[semester]) {
      acc[semester] = []
    }
    acc[semester].push(subject)
    return acc
  }, {})
}
</script>

<template>
  <main class="h-full container mx-auto p-6 xl:max-w-7xl">
    <h1 class="title-h1 mb-5">Interesses</h1>
    <div v-for="(subjects, semester) in subjects" :key="semester" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Semestre {{ semester }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="subject in subjects"
          :key="subject.codigo"
          class="bg-bp_neutral-300 rounded-md border-0"
        >
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold">{{ subject.codigo }}</h1>
            <span
              class="justify-self-end text-sm bg-bp_yellow-200 text-bp_yellow-100 px-3 py-1 rounded-2xl font-semibold"
              >{{ subject.obrigatorio?"Obrigatório":"Optativa" }}</span
            >
          </div>
          <div class="flex flex-col gap-2">
            <p>{{ subject.nome }}</p>
            <div class="flex gap-4 items-center">
              <p>{{ subject.carga_horaria }}h</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </main>
</template>
