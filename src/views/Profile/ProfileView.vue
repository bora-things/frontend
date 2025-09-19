<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProfiles } from './ProfileController'

import ListItemFriend from '@/components/ListItemFriend.vue'
import SubjectCard from '@/components/SubjectCard.vue'

const route = useRoute()
const user = ref(null)

const classesCursados = ref([])
const classesInteresse = ref([])

const activeSection = ref('historico')

const selectedSemesterCursado = ref({})
const selectedSemesterInteresse = ref({})

const privacidade = ref(1)
const friends = ref([])
const semesters = ref([])
const isOwner = ref(false)
const isFriendsOpen = ref(false)

const isFriend = computed(() => {
  if(!user.value || !friends.value.length) return false;
  return friends.value.some(frind => frind.id === 1)
})

const openFriends = () => {
  isFriendsOpen.value = true
}

const closeFriends = () => {
  isFriendsOpen.value = false
}

const semestresCursados = computed(() => {
  return semesters.value.filter(s => !s.interesse)
})

const semestresInteresse = computed(() => {
  return semesters.value.filter(s => s.interesse)
})

const setSection = (section) => {
  activeSection.value = section
}

const selectSemesterCursado = (semester) => {
  selectedSemesterCursado.value = semester
}

const selectSemesterInteresse = (semester) => {
  selectedSemesterInteresse.value = semester
}

watch(selectedSemesterCursado, (newValue) => {
  const selected = newValue; 
  if (selected && selected.classes) {
    classesCursados.value = selected.classes;
  } else {
    classesCursados.value = [];
  }
});

watch(selectedSemesterInteresse, (newValue) => {
  const selected = newValue;
  if (selected && selected.classes) {
    classesInteresse.value = selected.classes;
  } else {
    classesInteresse.value = [];
  }
});

onMounted(async () => {
  const profiles = await getProfiles()
  const userId = parseInt(route.params.id)
  user.value = profiles.find((profile) => profile.id === userId)
  
  if (user.value) {
    friends.value = user.value.friends
    semesters.value = user.value.semesters
    if (semestresCursados.value.length > 0) {
      selectSemesterCursado(semestresCursados.value[0])
    }
    if (semestresInteresse.value.length > 0) {
      selectSemesterInteresse(semestresInteresse.value[0])
    }
    
    const loggedInUserId = 1
    isOwner.value = user.value.id === loggedInUserId
    privacidade.value = parseInt(user.value.privacidade)
  }
})
</script>

<template>
  <div class="bg-bp_neutral-800 p-4 md:p-10 rounded-2xl m-6 md:m-10 space-y-6 md:space-y-10">
    <div class="md:flex space-y-3 items-center md:justify-between">
      <div class="flex items-center space-x-4 md:space-x-10">
        <div class="avatar ">
          <div class="rounded-full p-4 bg-bp_neutral-600">
            <v-icon name="fa-user-alt" scale="4" ></v-icon>
          </div>
        </div>
        <div class="font-bold space-y-2 md:space-y-4">
          <p class="text-xl md:text-3xl">{{ user ? user.name : '...' }}</p>
          <div class="flex flex-wrap md:flex-row gap-4">
            <div class="flex gap-2 items-center">
              <v-icon name="io-school-sharp" scale="1.2"/>
              <p>{{ user ? user.course : '...' }}</p>
            </div>
            <div class="flex gap-2 items-center">
              <v-icon name="bi-calendar-event" scale="1.2"/>
              <p>{{ user ? user.period : '...' }}° Periodo</p>
            </div>
            <div 
            @click="openFriends"
            class="flex gap-2 items-center cursor-pointer hover:opacity-75 hover:text-bp_green-500 transition-opacity">
              <v-icon name="fa-user-friends" scale="1.4"/>
              <p>{{friends.length}} Amigos</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isFriendsOpen" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div class="bg-bp_neutral-800 p-6 rounded-2xl w-full max-w-4xl relative z-10 space-y-4">
          <button @click="closeFriends" class="absolute top-3 right-3 text-white hover:opacity-70">
            <v-icon name="fa-times" scale="1.5" />
          </button>

          <h2 class="text-xl font-bold text-white mb-2"> 
            <v-icon name="fa-user-friends" scale="1.4"/> Amigos de {{ user?.name }}</h2>

          <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-4 friends-container max-h-72 overflow-y-auto relative hide-scrollbar"
          >
            <div
              v-if="friends.length === 0"
              class="text-bp_grayscale-400 text-sm md:text-base col-span-full text-center"
            >
              Nenhum amigo encontrado!
            </div>

            <div
              v-for="(friend, index) in friends"
              :key="index"
              class="bg-bp_neutral-825 border border-bp_neutral-600 p-2 rounded flex items-center space-x-3"
            >
              <img
                :src="friend.urlImgPerfil"
                alt="foto do amigo"
                class="rounded-full w-12 h-12 object-cover"
              />
              <div>
                <p class="font-bold text-white">{{ friend.name }}</p>
                <p class="text-sm text-gray-300">
                  {{ friend.course }}
                  <span class="text-bp_neutral-400">{{ friend.period }}° período</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div @click="closeFriends" class="absolute inset-0"></div>
      </div>

      <div>
        <div v-if="!isOwner && !isFriend">
            <button class="bg-bp_green-500 hover:opacity-75 font-bold p-2 rounded-xl gap-x-2 flex items-center">
              <v-icon name="md-personadd" scale="1.5"/>
              Adicionar Amigo</button>
        </div>

        <div v-else-if="!isOwner && isFriend">
            <button class="bg-bp_neutral-900 font-bold p-2 rounded-xl gap-x-2 flex items-center">
              <v-icon name="md-personremove" scale="1.5"/>
              Remover Amigo</button>
        </div>
      </div>

    </div>

    <div v-if="isOwner || isFriend" class="space-y-4">
      <p class="text-xl md:text-2xl mb-2">Semestres Cursados</p>
      <div v-if="semestresCursados.length > 0" class="flex flex-wrap gap-3">
        <button
           v-for="semester in semestresCursados"
          :key="semester.semester"
          @click="selectSemesterCursado(semester)"
          class="font-bold p-2 rounded-xl w-20 text-center transition-colors duration-200"
          :class="selectedSemesterCursado.semester === semester.semester ? 'bg-bp_green-500 text-bp_neutral-900' : 'bg-bp_neutral-700 hover:bg-bp_neutral-600'"
        >
          {{ semester.period }}°
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SubjectCard 
          v-for="classItem in classesCursados" 
          :key="classItem.code"
          :classSubject="classItem" 
        />
      </div>
    </div>

      <div v-if="isOwner || isFriend" class="space-y-4">
      <p class="text-xl md:text-2xl mb-2">Interesses para Próximos Semestres</p>
        <div v-if="semestresInteresse.length > 0" class="flex flex-wrap gap-3">
          <button
            v-for="semester in semestresInteresse"
            :key="semester.semester"
            @click="selectSemesterInteresse(semester)"
            class="font-bold p-2 rounded-xl w-20 text-center transition-colors duration-200"
            :class="selectedSemesterInteresse?.semester === semester.semester ? 'bg-bp_pink-100 text-bp_neutral-900' : 'bg-bp_neutral-700 hover:bg-bp_neutral-600'"
          >
            {{ semester.period }}°
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SubjectCard 
            v-for="classItem in classesInteresse" 
            :key="classItem.code"
            :classSubject="classItem" 
            interest 
          />
        </div>
      </div>
  </div>
</template>