<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { getSubjectSyllabusData } from './SubjectSyllabusController';

const route = useRoute()

const subject = ref('')
const friends = ref([])
const teachers = ref([])

function getCorAprovacao(review) {
  if (review <= 5) {
    return 'text-bp_pink-100'
  } else if (review <= 7) {
    return 'text-bp_yellow-300'
  } else {
    return 'text-bp_green-600'
  }
}

onMounted(async () => {
  const subjectId = route.params.id
  const data = await getSubjectSyllabusData(subjectId)
  subject.value = data
  friends.value = data.friends
  teachers.value = data.teachers
})

</script>

<template>
  <div class="text-white p-6 min-h-screen">
    <div class="max-w-5xl mx-auto bg-bp_neutral-800 border-2 border-bp_neutral-600 rounded-lg p-6">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold mb-2 w-2/3">{{ subject.name }}</h1>
        <v-icon name="md-close-round" scale="1.5"/>
      </div>
        <div class="flex justify-between items-center">
            <div class="flex flex-wrap text-sm mb-4 gap-2">
                <span class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1">
                Código: {{ subject.code }}
                </span>
                <span class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1">
                Carga Horária: {{ subject.workload }}
                </span>
                <span class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1">
                Tipo: {{ subject.mandatory ? 'Obrigatória' : 'Optativa' }}
                </span>
            </div>
            
            <button class="bg-bp_green-500 px-2 py-1 rounded mb-6">
                + Adicionar à Grade
            </button>
        </div>


      <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md mb-8 p-4">
        <h2 class="text-xl font-semibold mb-2">Ementa da Disciplina</h2>
        <p class="text-sm text-gray-300">
         {{ subject.description }}
        </p>
      </section>

      <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md mb-8 p-4">
        <h2 class="text-xl font-semibold text-center mb-4">Professores Prováveis</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
                v-for="(teacher, index) in teachers"
                :key="index"
                class="bg-bp_neutral-825 border border-bp_neutral-600 p-2 rounded flex items-center space-x-3"
            >
                <img :src="teacher.urlImgPerfil" alt="" class="rounded-full w-12 h-12 object-cover" />
                <div>
                <p>{{ teacher.name }}</p>
                <p class="text-sm">
                    Avaliação:
                    <span :class="getCorAprovacao(teacher.review)">{{ teacher.review }}</span>
                </p>
                </div>
            </div>
        </div>
      </section>

      <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md p-4">
        <h2 class="text-xl font-semibold text-center mb-4">Amigos Interessados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="(friend, index) in friends" :key="index" class="bg-bp_neutral-825 border border-bp_neutral-600 p-2 rounded flex items-center space-x-3">
            <img :src="friend.urlImgPerfil" class="rounded-full w-12 h-12" />
            <div>
              <p>{{ friend.name }}</p>
              <p class="text-sm text-gray-300">{{ friend.course }} <span class="text-bp_neutral-400">{{ friend.period }}</span></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>