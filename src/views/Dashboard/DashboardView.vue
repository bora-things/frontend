<script setup>
import InputSearch from '@/components/InputSearch.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import SubjectCardEC from '@/components/SubjectCardEC.vue'
import api from '@/config/axios.config'
import { computed, onMounted, ref, watch } from 'vue'

const classes = ref(null)
const selectedClasses = ref([])
const periods = ref([])
const components = ref([
  {
    nome: 'CÁLCULO DIFERENCIAL E INTEGRAL I',
    'carga-horaria-total': 90,
    codigo: 'IMD0024',
    obrigatoria: true
  },
  {
    nome: 'CÁLCULO DIFERENCIAL E INTEGRAL I',
    'carga-horaria-total': 90,
    codigo: 'IMD0024',
    obrigatoria: true
  },
  {
    nome: 'CÁLCULO DIFERENCIAL E INTEGRAL I',
    'carga-horaria-total': 90,
    codigo: 'IMD0024',
    obrigatoria: true
  },
  {
    nome: 'CÁLCULO DIFERENCIAL E INTEGRAL I',
    'carga-horaria-total': 90,
    codigo: 'IMD0024',
    obrigatoria: true
  }
])
const componentsFiltered = ref([...components.value])
const searchQuery = ref('')
const selectedPeriod = ref('')

const componentType = ref('TODAS')

function selectPeriod(period) {
  selectedPeriod.value = period
  const periodClasses = classes.value[period]
  selectedClasses.value = periodClasses ? periodClasses.map((item) => ({ ...item })) : []
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

watch(
  () => componentType.value,
  (newValue) => {
    console.log(components.value)
    if (newValue === 'OBRIGATORIO') {
      componentsFiltered.value = components.value.filter((item) => item.obrigatoria)
    } else if (newValue === 'OPTATIVO') {
      componentsFiltered.value = components.value.filter((item) => !item.obrigatoria)
    } else {
      componentsFiltered.value = components
    }
  }
)

function toggleComponentType(type) {
  if (componentType.value === type) {
    componentType.value = 'TODAS' // Reseta para "TODAS" se o mesmo botão for clicado novamente
  } else {
    componentType.value = type // Define o tipo selecionado
  }
}
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
              <span>Limite alcançado</span>
            </div>
          </div>
          <span class="title-h2"> {{ selectedPeriodWorkload }}h </span>
        </div>
      </header>

      <section class="grid md:grid-cols-3 bg-[#2F2F2F] rounded-md gap-4 p-4" :key="selectedPeriod">
        <SubjectCard
          v-for="item in selectedClasses"
          :key="item.code"
          class="w-full"
          :classSubject="item"
        />
      </section>
      <div class="flex flex-col  mt-6">
        <div class="flex items-center justify-between lg:flex-row gap-3 p-2">
          <div class="flex flex-col md:flex-row md:justify-between items-center gap-5">
            <p class="title-h1">Estrutura Curricular</p>
            <InputSearch
              @search="updateSearchQuery"
              v-model="searchQuery"
              class=""
              placeholder="Pesquisar matérias"
            />
          </div>
          <div class="flex justify-end space-x-4 p-2 rounded-xl bg-bp_neutral-700 w-fit h-fit">
            <div class="flex items-center space-x-2">
              <button
                :class="[
                  'card-options rounded-xl border border-bp_green-600',
                  componentType === 'OBRIGATORIO' ? 'bg-bp_green-600' : ''
                ]"
                @click="toggleComponentType('OBRIGATORIO')"
              >
                Obrigatório
              </button>
            </div>
            <div class="flex items-center space-x-2">
              <button
                :class="[
                  'card-options rounded-xl border border-bp_primary-500',
                  componentType === 'OPTATIVO' ? 'bg-bp_primary-500' : ''
                ]"
                @click="toggleComponentType('OPTATIVO')"
              >
                Optativo
              </button>
            </div>
          </div>
        </div>

        <section
          class="max-w-full my-6 grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-[#2F2F2F] p-4"
        >
          <SubjectCardEC
            class="w-full"
            v-for="component in componentsFiltered"
            :key="component.code"
            :component="component"
          />
        </section>
      </div>
    </main>
  </div>
</template>
