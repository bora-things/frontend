<script>
import { h, ref, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useToast } from 'vue-toast-notification'
import { getDefaultSubjects, saveInterestedSubjects } from './InterestedSubjectsController'

const useSubjects = () => {
  const semesters = ref({})
  const loading = ref(false)
  const toast = useToast()

  const groupSemesters = (subjects) => {
    return subjects.reduce((acc, subject) => {
      const { semestre } = subject
      if (!acc[semestre]) {
        acc[semestre] = []
      }
      acc[semestre].push(subject)
      return acc
    }, {})
  }

  const getSubjects = async () => {
    const subjects = await getDefaultSubjects()
    semesters.value = groupSemesters(subjects)
  }

  const handleSaveInterestedSubjects = async () => {
    loading.value = true
    await saveInterestedSubjects()
    toast.success('Interesses salvos com sucesso')
    loading.value = false
  }

  const resetSubjects = () => {
    loading.value = true
    setTimeout(() => {
      getSubjects()
      loading.value = false
      toast.success('Interesses resetados com sucesso')
    }, 3000)
  }

  onMounted(getSubjects)

  return {
    semesters,
    loading,
    handleSaveInterestedSubjects,
    resetSubjects,
    groupSemesters,
    toast
  }
}

const useDragAndDrop = (semesters, toast) => {
  const checkPrerequisites = (subject, newSemester) => {
    const semestersKeys = Object.keys(semesters.value).sort()
    const currentSemesterIndex = semestersKeys.indexOf(newSemester)

    for (const prereq of subject.pre_requisitos) {
      let found = false
      for (let i = 0; i < currentSemesterIndex; i++) {
        if (semesters.value[semestersKeys[i]].some((s) => s.codigo === prereq)) {
          found = true
          break
        }
      }
      if (!found) {
        toast.error(`Matéria ${prereq} é pré-requisito para ${subject.codigo}`)
        return false
      }
    }
    return true
  }

  const checkDependencies = (subject, newSemester) => {
    const semestersKeys = Object.keys(semesters.value).sort()
    const currentSemesterIndex = semestersKeys.indexOf(newSemester)

    for (let i = 0; i <= currentSemesterIndex; i++) {
      for (const s of semesters.value[semestersKeys[i]]) {
        if (s.pre_requisitos.includes(subject.codigo)) {
          toast.error(`Matéria ${subject.codigo} é pré-requisito para ${s.codigo}`)
          return false
        }
      }
    }
    return true
  }

  const handleMove = (evt) => {
    const semesterFrom = evt.from.id
    const semesterTo = evt.to.id
    const subjectId = evt.item.id
    const subject = Object.values(semesters.value)
      .flat()
      .find((s) => s.codigo === subjectId)
    if (!checkPrerequisites(subject, semesterTo) || !checkDependencies(subject, semesterTo)) {
      const oldIndex = evt.oldIndex
      semesters.value[semesterTo] = semesters.value[semesterTo].filter(
        (s) => s.codigo !== subjectId
      )
      semesters.value[semesterFrom].splice(oldIndex, 0, subject)
    }
  }

  return {
    handleMove
  }
}

export default {
  name: 'InterestedSubjectsView',
  components: {
    draggable: VueDraggableNext,
  },
  setup() {
    const { semesters, loading, handleSaveInterestedSubjects, resetSubjects, toast } = useSubjects()
    const { handleMove } = useDragAndDrop(semesters, toast)

    return {
      semesters,
      loading,
      handleSaveInterestedSubjects,
      handleMove,
      resetSubjects
    }
  }
}
</script>
<template>
  <main class="h-full container mx-auto p-6 xl:max-w-7xl">
    <div class="w-full flex items-center justify-between">
      <h1 class="text-4xl mb-5">Interesses</h1>
      <div class="flex gap-4 items-center">
        <span class="loading loading-spinner loading-md" v-if="loading"></span>
        <button
          class="text-black px-4 py-2 bg-white rounded disabled:opacity-50 hover:bg-bp_neutral-200 duration-300"
          :disabled="loading"
          type="primary"
          @click="resetSubjects"
        >
          Resetar
        </button>
        <button
          class="text-white px-4 py-2 bg-bp_green-100 rounded disabled:opacity-50 hover:bg-bp_green-500 duration-300"
          type="primary"
          :disabled="loading"
          @click="handleSaveInterestedSubjects"
        >
          Salvar
        </button>
      </div>
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
        key="semester"
      >
        <div
          v-for="subject in subjects"
          :key="subject.codigo"
          :id="subject.codigo"
          class="bg-bp_neutral-700 rounded-md border shadow-lg p-4 cursor-pointer h-[100%] flex-col flex justify-between"
        >
          <div class="flex flex-col gap-2">
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
