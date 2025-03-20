<template>
  <main class="h-full container mx-auto p-6 xl:max-w-7xl">
    <h1 class="title-h1 mb-5">Interesses</h1>
    <div v-for="(subjects, semester) in subjectsBySemester" :key="semester" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Semestre {{ semester }}</h2>
      <draggable
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        :list="subjects"
        group="subjects"
        @change="log"
      >
        <Card
          v-for="subject in subjects"
          :key="subject.codigo"
          class="bg-bp_neutral-700 rounded-md border shadow-lg p-4"
        >
          <div class="flex justify-between items-center mb-2">
            <h1 class="text-xl font-bold">{{ subject.codigo }}</h1>
            <span
              class="justify-self-end text-sm bg-yellow-200 text-yellow-800 px-3 py-1 rounded-2xl font-semibold"
              >{{ subject.obrigatorio ? 'Obrigatório' : 'Optativa' }}</span
            >
          </div>
          <div class="flex flex-col gap-2">
            <p class="text-lg font-medium">{{ subject.nome }}</p>
            <div class="flex gap-4 items-center">
              <p><strong>Carga Horária:</strong> {{ subject.carga_horaria }}h</p>
            </div>
          </div>
        </Card>
      </draggable>
    </div>
  </main>
</template>

<script>
import { Card } from 'ant-design-vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { getDefaultSubjects } from './InterestedSubjectsController'

export default {
  name: 'InterestedSubjectsView',
  components: {
    draggable: VueDraggableNext
  },
  data() {
    return {
      subjectsBySemester: {}
    }
  },
  async mounted() {
    const subjects = await getDefaultSubjects()
    this.subjectsBySemester = this.groupSubjectsBySemester(subjects)
  },
  methods: {
    log(evt) {
      console.log(evt)
    },
    groupSubjectsBySemester(subjects) {
      return subjects.reduce((acc, subject) => {
        const { semestre } = subject
        if (!acc[semestre]) {
          acc[semestre] = []
        }
        acc[semestre].push(subject)
        return acc
      }, {})
    }
  }
}
</script>
