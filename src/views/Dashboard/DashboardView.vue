<script setup>
import SubjectCardEC from '@/components/SubjectCardEC.vue'
import api from '@/config/axios.config'
import { computed, onMounted, ref } from 'vue'

const classes = ref(null)
const selectedClasses = ref([])
const periods = ref([])
const components = ref([
  {
    name: 'CÁLCULO DIFERENCIAL E INTEGRAL I',
    workload: 90,
    code: 'IMD0024',
    friends: [
      {
        name: 'Lucas',
        imageUrl: ''
      },
      {
        name: 'Lucas',
        imageUrl: ''
      },
      {
        name: 'Lucas',
        imageUrl: ''
      }
    ]
  }
])
const searchQuery = ref('')
const selectedPeriod = ref('')

function selectPeriod(period) {
  selectedPeriod.value = period
  const periodClasses = classes.value[period]
  console.log(periodClasses)
  selectedClasses.value = periodClasses ? periodClasses.map((item) => ({ ...item })) : []
  console.log(selectedClasses.value)
}

async function fetchClasses() {
  try {
    const response = await api.get('/api/classrooms/me')
    const data = response.data
    const classesGroupedByPeriod = data.reduce((acc, item) => {
      const { ano, periodo } = item
      const periodKey = `${ano}-${periodo}`
      if (!acc[periodKey]) {
        acc[periodKey] = []
      }
      acc[periodKey].push(item)
      return acc
    }, {})
    classes.value = classesGroupedByPeriod
    periods.value = Object.keys(classesGroupedByPeriod).map((key) => {
      const [ano, periodo] = key.split('-')
      return { ano, periodo }
    })
    selectPeriod(periods.value[0].ano + '-' + periods.value[0].periodo)
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  }
}

onMounted(async () => {
  await fetchClasses()
})

const clearFilters = () => {
  searchQuery.value = ''
  selectedPeriod.value = 'Periodo'
}

const selectedPeriodWorkload = computed(() =>
  selectedClasses.value.reduce(
    (acc, item) => acc + (item.component?.['carga-horaria-total'] || 0),
    0
  )
)
</script>

<template>
  <div class="h-full w-full">
    <main class="h-full container mx-auto p-6 xl:max-w-7xl">
      <header class="flex items-center justify-between pb-4">
        <div class="flex flex-col items-start">
          <div class="flex flex-col">
            <span class="text-sm text-vtd-secondary-100">Escolha seu periodo</span>
            <select @change="selectPeriod($event.target.value)" class="bg-bp_neutral-800 title-h1">
              <option
                v-for="(period, index) in periods"
                :key="index"
                :value="`${period.ano}-${period.periodo}`"
                class="text-vtd-secondary-100"
              >
                {{ index + 1 }}º Período
              </option>
            </select>
          </div>
          <span class="text-vtd-secondary-100">{{ selectedPeriod.replace('-', '.') }}</span>
        </div>

        <div className="tooltip">
          <div className="tooltip-content text-xl tooltip-error tooltip-bottom">
            <div className="text-white ">
              <span >Limite alcançado</span>
            </div>
          </div>
          <span class="title-h2"> {{ selectedPeriodWorkload }}h </span>
        </div>
      </header>

      <section class="grid md:grid-cols-3 bg-[#2F2F2F] rounded-md gap-4 p-4" :key="selectedPeriod">
        <SubjectCardEC
          v-for="item in selectedClasses"
          :key="item.code"
          class="w-full"
          :classSubject="item"
        />
      </section>

      <!-- <div class="flex items-center justify-between lg:flex-row gap-3 p-2">
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-5">
          <p class="title-h1">Estrutura Curricular</p>
          <InputSearch @search="updateSearchQuery" v-model="searchQuery" class="" />
        </div>
        <div class="flex justify-end space-x-4 p-2 rounded-xl bg-bp_neutral-700 w-fit h-fit">
          <div class="flex items-center space-x-2">
            <select
              v-model="selectedPeriod"
              class="border-bp_green-600 card-options rounded-xl text-lg"
            >
              <option hidden value="Periodo">Período</option>
              <option value="1">1° Periodo</option>
              <option value="2">2° Periodo</option>
              <option value="3">3° Periodo</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <button class="card-options rounded-xl border border-bp_primary-500">Optativa</button>
          </div>
        </div>
      </div> -->

      <!-- <section
        class="max-w-full my-6 grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      >
        <SubjectCardEC
          class="w-full"
          v-for="subject in lastPeriod.classes"
          :key="subject.code"
          :classSubject="subject"
        />
      </section> -->
    </main>
  </div>
</template>
