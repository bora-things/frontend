<script setup>
import SubjectCard from '@/components/SubjectCard.vue'
import FriendInterests from '@/components/FriendsInterests.vue'
import api from '@/config/axios.config'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import {
  handleAddInterestedSubjectRequest,
  handleInterestedSubjectsRequest,
  handleRemoveInterestedSubjectRequest
} from './DashboardController.js'
import DashboardViewSubjects from './DashboardViewSubjects.vue'

const components = ref([])
const classes = ref(null)
const loading = ref(true)
const periods = ref([])
const interestedClasses = ref([])
const selectedPeriod = ref('')
const pageToFetch = ref(0)

const componentType = ref('TODAS')
const page = ref(0)

const isSearchActive = ref(false)

const selectedPeriodWorkload = computed(() => {
  if (!periodClasses.value.length) {
    return periodInterestedClasses.value.reduce(
      (acc, item) => acc + (item.component['carga-horaria-total'] || 0),
      0
    )
  } else {
    return periodClasses.value.reduce(
      (acc, item) => acc + (item.component['carga-horaria-total'] || 0),
      0
    )
  }
})

const periodClasses = computed(() => {
  if (!selectedPeriod.value) return []
  const periodKey = selectedPeriod.value
  return classes.value[periodKey] || []
})

const periodInterestedClasses = computed(() => {
  if (!selectedPeriod.value) return []
  const periodKey = selectedPeriod.value
  return interestedClasses.value[periodKey] || []
})

function selectPeriod(period) {
  if (period == 'new') {
    const lastPeriod = periods.value[periods.value.length - 1]
    const newPeriod = lastPeriod.periodo == 1 ? 2 : 1
    const newYear = lastPeriod.periodo == 2 ? Number(lastPeriod.ano) + 1 : lastPeriod.ano
    periods.value.push({ ano: newYear, periodo: newPeriod })
    selectedPeriod.value = newYear + '-' + newPeriod
    interestedClasses.value[selectedPeriod.value] = []
    nextTick(() => {
      if (sectionRef.value) sectionRef.value.focus()
    })
    return
  }
  selectedPeriod.value = period
  nextTick(() => {
    if (sectionRef.value) sectionRef.value.focus()
  })
}

async function fetchClasses() {
  try {
    const response = await api.get('/api/classrooms/me')
    const data = response.data.filter((item) => item.component)
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
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
  } finally {
    loading.value = false
  }
}

function setPeriods() {
  const classesPeriods = Object.keys(classes.value).map((key) => {
    const [ano, periodo] = key.split('-')
    return { ano, periodo }
  })
  const interestedPeriods = Object.keys(interestedClasses.value).map((key) => {
    const [ano, periodo] = key.split('-')
    return { ano, periodo }
  })

  const allPeriods = [...classesPeriods, ...interestedPeriods]
  periods.value = allPeriods
    .sort((a, b) => {
      if (a.ano === b.ano) {
        return a.periodo - b.periodo
      }
      return a.ano - b.ano
    })
    .filter((item, index, self) => {
      return index === self.findIndex((t) => t.ano === item.ano && t.periodo === item.periodo)
    })
}

let fetchInterestedClassesAbortController = null

async function fetchInterestedClasses() {
  // Cancela a requisição anterior, se houver
  if (fetchInterestedClassesAbortController) {
    fetchInterestedClassesAbortController.abort()
  }
  fetchInterestedClassesAbortController = new AbortController()
  const signal = fetchInterestedClassesAbortController.signal
  try {
    const data = await handleInterestedSubjectsRequest({ signal })
    interestedClasses.value = data.reduce((acc, item) => {
      const { year, period } = item
      const periodKey = `${year}-${period}`
      if (!acc[periodKey]) {
        acc[periodKey] = []
      }
      acc[periodKey].push(item)
      return acc
    }, {})
  } catch (error) {
    if (error.name === 'AbortError') {
      // Requisição cancelada, não faz nada
      return
    }
    console.error('Erro ao buscar disciplinas de interesse:', error)
  }
}

async function fetchComponents() {
  try {
    const response = await api.get(
      `/api/students/me/possible-subjects?page=${pageToFetch.value}&size=72`
    )
    const data = response.data
    components.value.push(...data)
    pageToFetch.value += 1
  } catch (error) {
    console.error('Erro ao buscar componentes:', error)
  }
}

watch(
  () => page.value,
  async (newPage) => {
    // Só busca mais páginas se não estiver em modo de busca
    if (isSearchActive.value) return
    // Calcula quantos itens já foram buscados
    const totalFetched = components.value.length
    // Se o usuário passar do último item carregado, busca a próxima página
    if ((newPage + 1) * 9 >= totalFetched) {
      await fetchComponents(pageToFetch.value)
    }
  }
)

onMounted(async () => {
  await Promise.all([fetchClasses(), fetchInterestedClasses(), fetchComponents()])
  setPeriods()
  selectPeriod(periods.value[0].ano + '-' + periods.value[0].periodo)
})

watch(
  () => componentType.value,
  (newValue) => {
    if (newValue === 'OBRIGATORIO') {
      componentsFiltered.value = components.value.filter((item) => item.obrigatoria)
    } else if (newValue === 'OPTATIVO') {
      componentsFiltered.value = components.value.filter((item) => !item.obrigatoria)
    } else {
      componentsFiltered.value = components
    }
  }
)

async function handleRemoveInterestedSubject(event) {
  const toSection = event.to.id
  if (toSection !== 'components') return
  const component = event.item
  await handleRemoveInterestedSubjectRequest(component.id)
  if (!interestedClasses.value[selectedPeriod.value].length) {
    delete interestedClasses.value[selectedPeriod.value]
    const period = selectedPeriod.value.split('-')[1] == 1 ? 2 : 1
    const year =
      selectedPeriod.value.split('-')[1] == 1
        ? selectedPeriod.value.split('-')[0] - 1
        : selectedPeriod.value.split('-')[0]
    selectedPeriod.value = year + '-' + period
    setPeriods()
    selectPeriod(selectedPeriod.value)
  }
  fetchInterestedClasses()
}

const blinkingIds = ref([])

async function handleAddInterestedSubject(event) {
  const component = event.item
  // Adiciona o id-turma ao array de blinking
  blinkingIds.value.push(component.id)
  await handleAddInterestedSubjectRequest({
    subjectCode: component.id,
    period: selectedPeriod.value.split('-')[1],
    year: selectedPeriod.value.split('-')[0]
  })
  await fetchInterestedClasses()
  // Remove o id-turma do blinking após o fetch
  const idx = blinkingIds.value.indexOf(component.id)
  if (idx !== -1) blinkingIds.value.splice(idx, 1)
}

function handleSearchedComponents(data) {
  // Replace the components list with the search results
  components.value = data.map((item) => ({
    year: null,
    period: null,
    'id-turma': item.codigo,
    component: item,
    friends: []
  }))
  // Reset pagination
  page.value = 0
  pageToFetch.value = 1 // Next fetch should append after search results if needed
  isSearchActive.value = true
}

const sectionRef = ref(null)
</script>
<template>
  <main class="container mx-auto p-6 xl:max-w-7xl flex flex-col flex-1">
    <header class="flex items-center justify-between pb-4">
      <div class="flex flex-col items-start">
        <div class="flex flex-col">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex="{0}"
              role="button"
              className=" m-1 title-h1 p-0 flex items-center gap-2 "
            >
              {{
                periods.findIndex(
                  (item) =>
                    item.ano == selectedPeriod.split('-')[0] &&
                    item.periodo == selectedPeriod.split('-')[1]
                ) + 1
              }}º Período
              <v-icon name="bi-chevron-down" scale="1.2"></v-icon>
            </div>
            <ul
              tabIndex="{0}"
              className="title-h2 dropdown-content menu bg-bp_grayscale-700 rounded-box z-1 w-52 p-2 shadow-sm gap-1"
            >
              <li
                :class="[
                  'hover:bg-bp_grayscale-800 p-2 rounded-md cursor-pointer',
                  selectedPeriod == `${period.ano}-${period.periodo}` ? 'bg-bp_grayscale-800' : ''
                ]"
                v-for="(period, index) in periods"
                :key="index"
                @click="selectPeriod(`${period.ano}-${period.periodo}`)"
              >
                {{ index + 1 }}º Período
              </li>
              <li
                class="hover:bg-bp_grayscale-700 p-2 rounded-md cursor-pointer"
                @click="selectPeriod('new')"
              >
                Novo Período
              </li>
            </ul>
          </div>
        </div>
        <span class="font-sans text-vtd-secondary-100">{{ selectedPeriod.replace('-', '.') }}</span>
      </div>

      <div className="tooltip tooltip-left">
        <div
          :class="[
            'tooltip-content text-xl',
            selectedPeriodWorkload < 480 ? 'tooltip-warning' : 'tooltip-error'
          ]"
          v-if="selectedPeriodWorkload > 360"
        > 
          <div className="text-white">
            <span>Limite {{ selectedPeriodWorkload < 480 ? 'Próximo' : 'Alcançado' }}</span>
          </div>
        </div>
        <div
          :class="[
            'text-2xl flex items-center',
            selectedPeriodWorkload > 360
              ? selectedPeriodWorkload >= 480
                ? 'text-red-500'
                : 'text-orange-400'
              : 'text-white'
          ]"
        >
          <v-icon name="bi-clock" scale="1.2" class="mr-2"></v-icon>
          <span> {{ selectedPeriodWorkload }}h</span>
        </div>
      </div>
    </header>

    <div
      v-if="loading"
      class="flex items-center bg-bp_grayscale-600 p-4 justify-center h-[15vh] w-full rounded-md"
    >
      <span class="loading loading-spinner loading-lg text-white"></span>
    </div>
    <section
      ref="sectionRef"
      tabindex="-1"
      v-if="!loading && periodClasses.length > 0"
      class="grid md:grid-cols-3 bg-bp_grayscale-600 rounded-md gap-4 p-4"
      :key="selectedPeriod"
    >
      <SubjectCard
        v-for="item in periodClasses"
        :key="item['id-turma']"
        class="w-full"
        :classSubject="item"
      />
    </section>
    <div
      v-else-if="!loading && periodClasses.length === 0"
      class="relative bg-bp_grayscale-600 rounded-md h-[400px] overflow-y-auto p-2 flex flex-col w-full"
    >
      <FriendInterests />
      <VueDraggableNext
        id="interested-classes"
        :animation="800"
        class="grid md:grid-cols-3 gap-4 p-4"
        :list="periodInterestedClasses"
        group="subjects"
        :key="(periodInterestedClasses || []).map((item) => item.interest_id).join(',')"
      >
        <SubjectCard
          v-for="item in periodInterestedClasses"
          :key="item.interest_id"
          class="w-full"
          :classSubject="item"
          :blinking="blinkingIds.includes(item.component.codigo)"
        />
        <div
          v-if="!loading && periodInterestedClasses.length == 0"
          class="bg-bp_grayscale-800 w-full h-[160px] rounded-md flex flex-col items-center gap-4 p-4 text-vtd-secondary-100 border border-dashed border-[3px] border-bp_grayscale-500"
        >
          <v-icon name="bi-plus-circle" scale="2.6" class="text-bp_grayscale-500"></v-icon>
          <div class="flex flex-col items-center">
            <span class="font-span font-medium">ARRASTE PARA ADICIONAR</span>
            <span class="font-span font-medium">NOVAS MATÉRIAS</span>
          </div>
        </div>
      </VueDraggableNext>

      <div
        v-if="periodInterestedClasses.length > 6"
        class="sticky -bottom-1 w-full h-[50px] bg-gradient-to-t from-bp_neutral-700 to-transparent"
      ></div>
    </div>
    <hr class="my-6 border-bp_grayscale-700" />
    <DashboardViewSubjects
      :components="components"
      :selected-period="selectedPeriod"
      :component-type="componentType"
      :handle-add-interested-subject="handleAddInterestedSubject"
      :handle-remove-interested-subject="handleRemoveInterestedSubject"
      v-model:page="page"
      :fetch-components="fetchComponents"
      @searched-components="handleSearchedComponents"
    />
  </main>
</template>
