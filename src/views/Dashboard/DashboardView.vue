<script setup>
import InputSearch from '@/components/InputSearch.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import SubjectCardEC from '@/components/SubjectCardEC.vue'
import api from '@/config/axios.config'
import { computed, onMounted, ref, watch } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

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
  if (period == 'new') {
    selectedClasses.value = []
    const lastPeriod = periods.value[periods.value.length - 1]
    const newPeriod = lastPeriod.periodo == 1 ? 2 : 1
    const newYear = lastPeriod.periodo == 2 ? Number(lastPeriod.ano) + 1 : lastPeriod.ano
    periods.value.push({ ano: newYear, periodo: newPeriod })
    selectedPeriod.value = newYear + '-' + newPeriod
    return
  }
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
            <select
              @change="selectPeriod($event.target.value)"
              v-model="selectedPeriod"
              class="bg-bp_neutral-800 title-h1"
            >
              <option
                v-for="(period, index) in periods"
                :key="index"
                :value="`${period.ano}-${period.periodo}`"
                class="text-vtd-secondary-100"
              >
                {{ index + 1 }}º Período
              </option>
              <option value="new" class="text-vtd-secondary-100">Novo Período</option>
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

      <section
        v-if="selectedClasses.length > 0"
        class="grid md:grid-cols-3 bg-[#1F1F1F] rounded-md gap-4 p-4"
        :key="selectedPeriod"
      >
        <SubjectCard
          v-for="item in selectedClasses"
          :key="item.code"
          class="w-full"
          :classSubject="item"
        />
      </section>
      <VueDraggableNext
        v-else
        id="subjects"
        :animation="800"
        class="grid md:grid-cols-3 bg-[#1F1F1F] rounded-md gap-4 p-4"
        group="subjects"
        @end="handleMove"
        key="semester"
      >
        <div
          v-for="item in [1, 2, 3]"
          class="bg-bp_grayscale-800 w-full h-[160px] rounded-md flex flex-col items-center gap-4 p-4 text-vtd-secondary-100 border border-dashed border-[3px] border-bp_grayscale-600"
        >
          <v-icon name="bi-plus-circle" scale="2.6" class="text-bp_grayscale-600"></v-icon>
          <div class="flex flex-col gap-2 items-center font-medium">
            <span>ARRASTE PARA ADICIONAR</span>
            <span>NOVAS MATÉRIAS</span>
          </div>
        </div>
      </VueDraggableNext>
      <div class="flex flex-col mt-6">
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

        <VueDraggableNext
          id="subjects"
          :animation="800"
          class="grid md:grid-cols-3 bg-[#1F1F1F] rounded-md gap-4 p-4"
          group="subjects"
          @end="handleMove"
          key="semester"
        >
          <SubjectCardEC
            class="w-full"
            v-for="component in componentsFiltered"
            :key="component.code"
            :component="component"
          />
        </VueDraggableNext>
      </div>
    </main>
  </div>
</template>
