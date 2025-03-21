<script>
import { VueDraggableNext } from 'vue-draggable-next'
import { getDefaultSubjects } from './InterestedSubjectsController'

export default {
  name: 'InterestedSubjectsView',
  components: {
    draggable: VueDraggableNext,
  },
  data() {
    return {
      semesters: {}
    }
  },
  async mounted() {
    const subjects = await getDefaultSubjects()
    this.semesters = this.groupSemesters(subjects)
  },
  methods: {
    groupSemesters(subjects) {
      return subjects.reduce((acc, subject) => {
        const { semestre } = subject
        if (!acc[semestre]) {
          acc[semestre] = []
        }
        acc[semestre].push(subject)
        return acc
      }, {})
    },
    checkPrerequisites(subject, newSemester) {
      const semesters = Object.keys(this.semesters).sort()
      const currentSemesterIndex = semesters.indexOf(newSemester)
      for (const prereq of subject.pre_requisitos) {
        for (let i = currentSemesterIndex; i < semesters.length; i++) {
          if (this.semesters[semesters[i]].some((s) => s.codigo === prereq)) {
            this.$toast.error(`Matéria ${prereq} é pré-requisito para ${subject.codigo}`)
            return false
          }
        }
      }
      return true
    },
    checkDependencies(subject, newSemester) {
      const semesters = Object.keys(this.semesters).sort()
      const currentSemesterIndex = semesters.indexOf(newSemester)

      for (let i = 0; i <= currentSemesterIndex; i++) {
        for (const s of this.semesters[semesters[i]]) {
          if (s.pre_requisitos.includes(subject.codigo)) {
            this.$toast.error(`Matéria ${subject.codigo} é pré-requisito para ${s.codigo}`)
            return false
          }
        }
      }
      return true
    },
    handleMove(evt) {
      console.log(evt)
      const semesterFrom = evt.from.id
      const semesterTo = evt.to.id
      const subjectId = evt.item.id
      const subject = Object.values(this.semesters).flat().find((s) => s.codigo === subjectId)
      if (
        !this.checkPrerequisites(subject, semesterTo) ||
        !this.checkDependencies(subject, semesterTo)
      ) {
        const oldIndex=evt.oldIndex;
        this.semesters[semesterTo] = this.semesters[semesterTo].filter(
          (s) => s.codigo !== subjectId
        )
        this.semesters[semesterFrom].splice(oldIndex, 0, subject)
      }
    }
  }
}
</script>
<template>
  <main class="h-full container mx-auto p-6 xl:max-w-7xl">
    <div class="w-full flex items-center justify-between">
      <h1 class="text-4xl mb-5">Interesses</h1>
      <button class="bg-white text-black px-4 py-2 rounded btn" type="primary">Salvar</button>
    </div>
    <div v-for="(subjects, semester) in semesters" :key="semester" class="mb-8">
      <h2 class="text-2xl font-bold mb-4">Semestre {{ semester }}</h2>
      <draggable
        :id="semester"
        :animation="800"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        :list="subjects"
        group="subjects"
        @end="handleMove"
        dropzone="move"
        key="semester"
      >
        <div
          v-for="subject in subjects"
          :key="subject.codigo"
          :id="subject.codigo"
          class="bg-bp_neutral-700 rounded-md border shadow-lg p-4 cursor -pointer h-[100%]"
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
        </div>
        <template v-if="!subjects.length">
          <div class="bg-bp_neutral-700 rounded-md border shadow-lg p-4 cursor-pointer h-[100%]">
            <span>Semestre sem matérias de interesse</span>
          </div>
        </template>
      </draggable>
    </div>
  </main>
</template>
