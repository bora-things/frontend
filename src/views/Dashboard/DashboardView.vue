<script setup>
import PeriodCard from '@/components/PeriodCard.vue'
import RadialProgress from '@/components/RadialProgress.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import { useDashboardUser } from '@/services/useDashboardUser'
import { onMounted, ref } from 'vue'

const { user, fetchUser } = useDashboardUser()
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
</script>

<template>
  <div class="h-full w-full">
    <main class="h-full container mx-auto p-6 xl:max-w-7xl">
      <header class="flex items-center justify-between border-b border-bp_neutral-700 pb-4">
        <h1 class="title-h1">Período Atual · {{ lastPeriod.periodNumber }}º</h1>
        <span class="title-h1 text-bp_primary-100">
          {{ lastPeriod.classes?.reduce((acc, item) => acc + item.workload, 0) }} h
        </span>
      </header>

      <section
        class="max-w-full my-6 grid grid-cols-1 place-items-center sm:place-items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
      >
        <SubjectCard
          class="w-full"
          v-for="subject in lastPeriod.classes"
          :key="subject.code"
          :classSubject="subject"
        />
      </section>

      <section class="mt-12 w-full">
        <header class="w-full md:w-3/5 flex items-center justify-between flex-wrap gap-4 sm:gap-0">
          <h1 class="title-h1">Períodos</h1>
          <RouterLink to="/interesses" class="hover:underline underline-offset-4">
            <v-icon name="md-add" scale="1.25" />
            Adicionar Interesse
          </RouterLink>
        </header>

        <div class="w-full flex flex-col md:flex-row items-start justify-between gap-6 mt-8">
          <div class="w-full md:w-3/5 flex flex-col gap-6">
            <PeriodCard v-for="period in periods.sort((a,b)=>b.periodNumber-a.periodNumber)" :key="period.periodNumber" :period="period" />
          </div>

          <aside class="w-full md:w-2/5 lg:w-1/3">
            <div class="bg-bp_neutral-700 p-6 rounded-lg flex flex-col items-center gap-3">
              <div class="w-full flex items-center justify-between mb-6">
                <h4 class="font-bold text-xl">Evolução</h4>
                <span class="text-bp_primary-50 cursor-pointer">Mais</span>
              </div>

              <RadialProgress
                :progress="
                  ((100 * workload.mandatoryPending + workload.optionalPending) /
                  workload.totalCourse).toFixed(1)
                "
              />

              <p class="mt-6 w-full flex items-center justify-between">
                <span>C.H. obrigatória pendente</span>
                <span class="text-bp_primary-100">{{ workload.mandatoryPending }}</span>
              </p>
              <p class="w-full flex items-center justify-between">
                <span>C.H. optativa pendente</span>
                <span class="text-bp_primary-100">{{ workload.optionalPending }}</span>
              </p>
              <p class="w-full flex items-center justify-between">
                <span>C.H. total do curso</span>
                <span class="text-bp_primary-100">{{ workload.totalCourse }}</span>
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  </div>
</template>
