<script setup>
import PeriodCard from '@/components/PeriodCard.vue'
import RadialProgress from '@/components/RadialProgress.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import CardNewDiscipline from '@/components/CardNewDiscipline.vue'
import { onMounted, ref } from 'vue'
import SubjectCardEC from '@/components/SubjectCardEC.vue'
import InputSearch from '@/components/InputSearch.vue'

const user = ref(null)
const searchQuery = ref('');
const selectedPeriod = ref('Periodo');

async function fetchUser() {
  try {
    const response = await fetch('/src/assets/mocks/UserMockData.json') // Caminho do mock
    const data = await response.json()
    user.value = data
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
}

const periods = ref([])
const workload = ref({})
const lastPeriod = ref({})

onMounted(async () => {
  await fetchUser()
  if (user.value) {
    periods.value = user.value.periods
    workload.value = user.value.workload
    lastPeriod.value = periods.value.sort((a, b) => b.period - a.period)[0]
  }
})

const clearFilters = () => {
  searchQuery.value = '';
  selectedPeriod.value = 'Periodo';
};
</script>

<template>
  <div class="h-full w-full">
    <main class="h-full container mx-auto p-6 xl:max-w-7xl">
      <header class="flex items-center justify-between border-b border-bp_neutral-700 pb-4">
        <div class="flex flex-col items-end">
          <div class="flex flex-col">
            <span class="text-sm text-vtd-secondary-500">Escolha seu periodo</span>          
            <select class="bg-bp_neutral-800 title-h1">
              <option
              class="text-md"
                v-for="period in periods"
                :key="period.periodNumber"
                :value="period.periodNumber"
              >
            {{ period.periodNumber }}° Periodo
            </option>
            </select>
          </div>
          
          <span class="text-vtd-secondary-500 mr-0">2025.2</span>
        </div>
        <span class="title-h1 border-2 border-dashed rounded-lg p-1.5 border-bp_green-100">
          {{ lastPeriod.classes?.reduce((acc, item) => acc + item.workload, 0) }} h
        </span>
      </header>

      <section class=" grid md:grid-cols-3 lg:grid-cols-4 border-y-2 border-vtd-secondary-700 gap-4 py-4">
        <CardNewDiscipline/>
        <CardNewDiscipline/>
        <CardNewDiscipline/>
        <CardNewDiscipline/>
      </section>

      <div class="flex items-center justify-between lg:flex-row gap-3 p-2">
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-5">
          <p class="title-h1">Estrutura Curricular</p>
          <InputSearch
          @search="updateSearchQuery"
          v-model="searchQuery" class="" />
        </div>
        <div class="flex justify-end space-x-4 p-2 rounded-xl bg-bp_neutral-700 w-fit h-fit">
          <div class="flex items-center space-x-2">
            <select v-model="selectedPeriod" class="border-bp_green-600 card-options rounded-xl text-lg">
              <option hidden value="Periodo">Período</option>
              <option value="1">1° Periodo</option>
              <option value="2">2° Periodo</option>
              <option value="3">3° Periodo</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <button class="card-options rounded-xl border border-bp_primary-500 ">Optativa</button>
          </div>
        </div>
      </div>

      <section
        class="max-w-full my-6 grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      >
        <SubjectCardEC
          class="w-full"
          v-for="subject in lastPeriod.classes"
          :key="subject.code"
          :classSubject="subject"
        />
      </section> 
    </main>
  </div>
</template>
