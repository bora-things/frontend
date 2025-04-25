<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProfiles } from './ProfileController'

import ListItemFriend from '@/components/ListItemFriend.vue'
import SubjectCard from '@/components/SubjectCard.vue'

const route = useRoute()
const user = ref(null)

const classes = ref([])
const activeSection = ref('historico')
const selectedSemester = ref({})
const privacidade = ref(1)
const friends = ref([])
const semesters = ref([])

const isOwner = ref(false)

const setSection = (section) => {
  activeSection.value = section
}

const selectSemester = (semester) => {
  selectedSemester.value = semester
}

watch(selectedSemester, (newValue) => {
  const selected = semesters.value.find((semester) => semester.period === newValue.period)
  if (selected) {
    classes.value = selected.classes
  }
})

onMounted(async () => {
  const profiles = await getProfiles()
  const userId = parseInt(route.params.id)
  user.value = profiles.find((profile) => profile.id === userId)
  friends.value = user.value.friends
  semesters.value = user.value.semesters
  selectSemester(semesters.value[0])
  const loggedInUserId = 1
  isOwner.value = user.value && user.value && user.value.id === loggedInUserId

  privacidade.value = parseInt(user.value.privacidade)
})
</script>

<template>
  <div class="bg-bp_neutral-800 p-4 md:p-10 rounded-2xl m-6 md:m-10">
    <div class="flex items-center space-x-4 md:space-x-10">
      <div class="avatar ">
        <div class="rounded-full p-4 bg-bp_neutral-600">
          <v-icon name="fa-user-alt" scale="4" ></v-icon>
        </div>
      </div>
      <div class="font-bold space-y-2 md:space-y-4">
        <p class="text-xl md:text-3xl">{{ user ? user.name : '...' }}</p>
        <div class="flex gap-6">
          <div class="flex gap-2 items-center">
            <v-icon name="io-school-sharp" />
            <p>{{ user ? user.course : '...' }}</p>
          </div>
          <div class="flex gap-2 items-center">
            <v-icon name="bi-calendar-event" />
            <p>{{ user ? user.period : '...' }}° periodo</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex mt-6 mb-6">
      <div class="space-x-2 md:space-x-6 md:flex">
        <button
          @click="setSection('historico')"
          :class="['nav-item', activeSection === 'historico' ? 'active-nav' : '']"
        >
          <div class="flex items-center gap-x-2"><v-icon name="hi-solid-document-text" scale="1.3" /> Histórico</div>
        </button>
        <button
          @click="setSection('amigos')"
          :class="['nav-item', activeSection === 'amigos' ? 'active-nav' : '']"
        >
          <div class="flex items-center gap-x-2"><v-icon name="fa-user-friends" scale="1.5" /> Amigos</div>
        </button>
        <button
          v-if="isOwner"
          @click="setSection('configuracoes')"
          :class="['nav-item', activeSection === 'configuracoes' ? 'active-nav' : '']"
        >
          <div class="flex items-center gap-x-2"><v-icon name="bi-gear-fill" scale="1.3" /> Configurações</div>
        </button>
      </div>
    </div>

    <!-- Histórico -->
    <div v-if="activeSection === 'historico' && selectSemester" class="space-y-0">
      <div class="flex gap-1 ml-6">
        <div
          v-for="semester in semesters"
          :key="semester"
          @click="selectSemester(semester)"
          :class="[
            'w-10 h-9 rounded-t-2xl font-bold flex items-center justify-center  cursor-pointer',
            selectedSemester.period === semester.period
              ? semester.interesse
                ? 'bg-white/60'
                : 'bg-neutral-600'
              : semester.interesse
                ? 'bg-white/40'
                : 'bg-bp_neutral-700',
            semester.interesse ? 'hover:bg-white/60' : 'hover:bg-bp_neutral-600'
          ]"
        >
          {{ semester.period }}
        </div>
      </div>
      <div
        :class="[
          'rounded-md  p-4 flex flex-col gap-4 ',
          selectedSemester.interesse ? 'bg-white/60' : 'bg-bp_neutral-600'
        ]"
      >
        <h2 :class="['title-h2', selectedSemester.interesse ? 'text-black' : 'text-white']">
          {{ selectedSemester.semester
          }}{{ selectedSemester.interesse ? ' - Matérias Interessadas' : '' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SubjectCard
            v-for="classs in classes"
            :key="classs.code"
            :classSubject="classs"
            :interest="selectedSemester.interesse"
          />
        </div>
      </div>
    </div>

    <!-- Amigos -->
    <div v-if="activeSection === 'amigos'" class="text-white p-4">
      <p class="text-2xl font-bold mb-4">Amigos</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ListItemFriend v-for="(friend, index) in friends" v-bind:key="index" :friend="friend" />
      </div>
    </div>

    <!-- Configurações -->
    <div v-if="activeSection === 'configuracoes'" class="text-white p-4 space-y-4">
      <p class="text-lg font-bold">Configurações</p>

      <div>
        <label for="privacidade" class="block text-sm font-medium text-gray-300"
          >Privacidade da Conta</label
        >
        <select
          id="privacidade"
          v-model="privacidade"
          class="w-full py-4 bg-bp_neutral-800 border border-bp_neutral-700 rounded py-2 px-4 text-bp_neutral-50 placeholder:text-bp_neutral-700"
        >
          <option value="1">Pública</option>
          <option value="0">Privada</option>
          <option value="2">Somente Amigos</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    semester() {
      // Ensure semester is defined before accessing properties
      return this.selectedSemester || {}
    }
  }
}
</script>
