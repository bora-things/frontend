<script setup>
import EnrollmentDashboard from "@/components/EnrollmentDashboard.vue";
import FriendInterests from "@/components/FriendsInterests.vue";
import SubjectCard from "@/components/SubjectCard.vue";
import api from "@/config/axios.config";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";

import EnrollmentCard from "@/components/EnrollmentCard.vue";
import PeriodSelect from "@/components/PeriodSelect.vue";
import { formatProcessedDate } from "@/utils/formatProcessedDate.js";
import {
  fetchCalendarData,
  fetchEnrollments,
  getCurrentEnrollmentPeriod,
  handleAddInterestedSubjectRequest,
  handleInterestedSubjectsRequest,
  handleRemoveInterestedSubjectRequest,
} from "./DashboardController.js";
import DashboardViewSubjects from "./DashboardViewSubjects.vue";

const components = ref([]);
const classes = ref(null);
const loading = ref(true);
const periods = ref([]);
const interestedClasses = ref([]);
const selectedPeriod = ref("");
const pageToFetch = ref(0);

const componentType = ref("TODAS");
const page = ref(0);

const isSearchActive = ref(false);
const enrollments = ref([]);
const reEnrollments = ref([]);
const enrollmentPeriods = ref([]);
const currentEnrollmentPeriod = ref(null);

const isEnrollmentPeriod = computed(() => {
  return selectedPeriod.value?.startsWith("enrollment-");
});

const isReEnrollmentPeriod = computed(() => {
  return currentEnrollmentPeriod.value?.type === "reEnrollment";
});

const selectedPeriodWorkload = computed(() => {
  if (isEnrollmentPeriod.value) return 0;
  if (!periodClasses.value.length) {
    return periodInterestedClasses.value.reduce(
      (acc, item) => acc + (item.component["carga-horaria-total"] || 0),
      0
    );
  } else {
    return periodClasses.value.reduce(
      (acc, item) => acc + (item.component["carga-horaria-total"] || 0),
      0
    );
  }
});

const periodClasses = computed(() => {
  if (!selectedPeriod.value) return [];
  const periodKey = selectedPeriod.value;
  return classes.value[periodKey] || [];
});

const periodInterestedClasses = computed(() => {
  if (!selectedPeriod.value) return [];
  const periodKey = selectedPeriod.value;
  return interestedClasses.value[periodKey] || [];
});

function selectPeriod(period) {
  if (period == "new") {
    const lastPeriod = periods.value[periods.value.length - 1];
    const newPeriod = lastPeriod.periodo == 1 ? 2 : 1;
    const newYear = lastPeriod.periodo == 2 ? Number(lastPeriod.ano) + 1 : lastPeriod.ano;
    periods.value.push({ ano: newYear, periodo: newPeriod });
    selectedPeriod.value = newYear + "-" + newPeriod;
    interestedClasses.value[selectedPeriod.value] = [];
    nextTick(() => {
      if (sectionRef.value) sectionRef.value.focus();
    });
    return;
  }
  selectedPeriod.value = period;
  nextTick(() => {
    if (sectionRef.value) sectionRef.value.focus();
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchClasses() {
  const MAX_TENTATIVAS = 5; // Tenta no máximo 5 vezes
  const DELAY_MS = 2000; // Espera 2 segundos entre as tentativas

  try {
    let data = [];

    // Inicia o loop de tentativas (polling)
    for (let i = 0; i < MAX_TENTATIVAS; i++) {
      const response = await api.get("/api/classrooms/me");
      data = response.data.filter((item) => item.component);

      if (data.length > 0) {
        break;
      }

      await delay(DELAY_MS);
    }

    const classesGroupedByPeriod = data.reduce((acc, item) => {
      const { ano, periodo } = item;
      const periodKey = `${ano}-${periodo}`;
      if (!acc[periodKey]) {
        acc[periodKey] = [];
      }
      acc[periodKey].push(item);
      return acc;
    }, {});
    classes.value = classesGroupedByPeriod;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  } finally {
    loading.value = false;
  }
}

function setPeriods() {
  const classesPeriods = Object.keys(classes.value).map((key) => {
    const [ano, periodo] = key.split("-");
    return { ano, periodo, interest: false };
  });
  const interestedPeriods = Object.keys(interestedClasses.value).map((key) => {
    const [ano, periodo] = key.split("-");
    return { ano, periodo, interest: true };
  });

  const allPeriods = [...classesPeriods, ...interestedPeriods];
  const sortedPeriods = allPeriods
    .sort((a, b) => {
      if (a.ano === b.ano) {
        return a.periodo - b.periodo;
      }
      return a.ano - b.ano;
    })
    .filter((item, index, self) => {
      return (
        index === self.findIndex((t) => t.ano === item.ano && t.periodo === item.periodo)
      );
    });

  const enrollmentPeriodsToAdd = enrollmentPeriods.value
    .filter((ep) => {
      // Só adiciona períodos de matrícula que não existem ainda
      return !sortedPeriods.find(
        (period) => period.ano == ep.ano && period.periodo == ep.periodo
      );
    })
    .map((ep) => ({
      ano: ep.ano,
      periodo: ep.periodo,
      isEnrollment: true,
    }));

  periods.value = [...sortedPeriods, ...enrollmentPeriodsToAdd];

  periods.value = periods.value.sort((a, b) => {
    if (a.ano == b.ano) {
      return a.periodo - b.periodo;
    }
    return a.ano - b.ano;
  });
}

let fetchInterestedClassesAbortController = null;

async function fetchInterestedClasses() {
  if (fetchInterestedClassesAbortController) {
    fetchInterestedClassesAbortController.abort();
  }
  fetchInterestedClassesAbortController = new AbortController();
  const signal = fetchInterestedClassesAbortController.signal;
  try {
    const data = await handleInterestedSubjectsRequest({ signal });
    interestedClasses.value = data.reduce((acc, item) => {
      const { year, period } = item;
      const periodKey = `${year}-${period}`;
      if (!acc[periodKey]) {
        acc[periodKey] = [];
      }
      acc[periodKey].push(item);
      return acc;
    }, {});
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    console.error("Erro ao buscar disciplinas de interesse:", error);
  }
}

async function fetchComponents() {
  try {
    const response = await api.get(
      `/api/students/me/possible-subjects?page=${pageToFetch.value}&size=72`
    );
    const data = response.data;
    components.value.push(...data);
    pageToFetch.value += 1;
  } catch (error) {
    console.error("Erro ao buscar componentes:", error);
  }
}

async function fetchEnrollmentData() {
  try {
    // Busca o calendário acadêmico
    const calendarData = await fetchCalendarData();
    currentEnrollmentPeriod.value = getCurrentEnrollmentPeriod(calendarData);

    if (!currentEnrollmentPeriod.value) {
      enrollments.value = [];
      reEnrollments.value = [];
      enrollmentPeriods.value = [];
      return;
    }

    const { type, year, period } = currentEnrollmentPeriod.value;

    if (type === "enrollment") {
      enrollments.value = await fetchEnrollments(false);
      reEnrollments.value = [];
      enrollmentPeriods.value = [
        {
          ano: enrollments.value.length ? enrollments.value[0].ano : year,
          periodo: enrollments.value.length ? enrollments.value[0].periodo : period,
        },
      ];
    } else if (type === "reEnrollment") {
      reEnrollments.value = await fetchEnrollments(true);
      enrollments.value = [];

      enrollmentPeriods.value = [];
    }
  } catch (error) {
    console.error("Erro ao buscar dados de matrícula:", error);
  }
}

watch(
  () => page.value,
  async (newPage) => {
    // Só busca mais páginas se não estiver em modo de busca
    if (isSearchActive.value) return;
    // Calcula quantos itens já foram buscados
    const totalFetched = components.value.length;
    // Se o usuário passar do último item carregado, busca a próxima página
    if ((newPage + 1) * 9 >= totalFetched) {
      await fetchComponents(pageToFetch.value);
    }
  }
);

onMounted(async () => {
  await Promise.all([
    fetchClasses(),
    fetchInterestedClasses(),
    fetchComponents(),
    fetchEnrollmentData(),
  ]);
  setPeriods();

  // Define o período padrão baseado no período acadêmico atual
  if (currentEnrollmentPeriod.value) {
    const defaultPeriod = `${currentEnrollmentPeriod.value.year}-${currentEnrollmentPeriod.value.period}`;
    // Verifica se o período existe na lista de períodos
    const periodExists = periods.value.some(
      (p) =>
        p.ano == currentEnrollmentPeriod.value.year &&
        p.periodo == currentEnrollmentPeriod.value.period
    );
    if (periodExists) {
      selectPeriod(defaultPeriod);
    } else {
      // Se não existir, usa o primeiro período disponível
      selectPeriod(periods.value[0].ano + "-" + periods.value[0].periodo);
    }
  } else {
    // Fallback para o primeiro período se não houver período acadêmico atual
    selectPeriod(periods.value[0].ano + "-" + periods.value[0].periodo);
  }
});

watch(
  () => componentType.value,
  (newValue) => {
    if (newValue === "OBRIGATORIO") {
      componentsFiltered.value = components.value.filter((item) => item.obrigatoria);
    } else if (newValue === "OPTATIVO") {
      componentsFiltered.value = components.value.filter((item) => !item.obrigatoria);
    } else {
      componentsFiltered.value = components;
    }
  }
);

async function handleRemoveInterestedSubject(event) {
  const toSection = event.to.id;
  if (toSection !== "components") return;
  const component = event.item;
  await handleRemoveInterestedSubjectRequest(component.id);
  if (!interestedClasses.value[selectedPeriod.value].length) {
    delete interestedClasses.value[selectedPeriod.value];
    const period = selectedPeriod.value.split("-")[1] == 1 ? 2 : 1;
    const year =
      selectedPeriod.value.split("-")[1] == 1
        ? selectedPeriod.value.split("-")[0] - 1
        : selectedPeriod.value.split("-")[0];
    selectedPeriod.value = year + "-" + period;
    setPeriods();
    selectPeriod(selectedPeriod.value);
  }
  fetchInterestedClasses();
}

const blinkingIds = ref([]);

async function handleAddInterestedSubject(event) {
  const component = event.item;
  // Adiciona o id-turma ao array de blinking
  blinkingIds.value.push(component.id);
  await handleAddInterestedSubjectRequest({
    subjectCode: component.id,
    period: selectedPeriod.value.split("-")[1],
    year: selectedPeriod.value.split("-")[0],
  });
  await fetchInterestedClasses();
  // Remove o id-turma do blinking após o fetch
  const idx = blinkingIds.value.indexOf(component.id);
  if (idx !== -1) blinkingIds.value.splice(idx, 1);
}

function handleSearchedComponents(data) {
  // Replace the components list with the search results
  components.value = data.map((item) => ({
    year: null,
    period: null,
    "id-turma": item.codigo,
    component: item,
    friends: [],
  }));
  // Reset pagination
  page.value = 0;
  pageToFetch.value = 1;
  isSearchActive.value = true;
}

const sectionRef = ref(null);
</script>
<template>
  <div class="container mx-auto p-6 w-[70%] 2xl:w-[60%] flex flex-col flex-1">
    <header class="flex items-center justify-between pb-4">
      <PeriodSelect
        :periods="periods"
        :selected-period="selectedPeriod"
        @select-period="selectPeriod"
      />

      <div class="flex items-center gap-4">
        <div className="tooltip tooltip-left" v-if="!isEnrollmentPeriod">
          <div
            :class="[
              'tooltip-content text-xl',
              selectedPeriodWorkload < 480 ? 'tooltip-warning' : 'tooltip-error',
            ]"
            v-if="selectedPeriodWorkload > 360"
          >
            <div className="text-white">
              <span
                >Limite {{ selectedPeriodWorkload < 480 ? "Próximo" : "Alcançado" }}</span
              >
            </div>
          </div>
          <div
            :class="[
              'text-2xl flex items-center',
              selectedPeriodWorkload > 360
                ? selectedPeriodWorkload >= 480
                  ? 'text-red-500'
                  : 'text-orange-400'
                : 'text-white',
            ]"
          >
            <v-icon name="bi-clock" scale="1.2" class="mr-2"></v-icon>
            <span class="text-md"> {{ selectedPeriodWorkload }}h</span>
          </div>
        </div>
      </div>
    </header>

    <section
      v-if="isEnrollmentPeriod && !isReEnrollmentPeriod"
      class="bg-bp_neutral-700 rounded-md p-4"
      ref="sectionRef"
      tabindex="-1"
    >
      <EnrollmentDashboard
        :enrollments="enrollments"
        :re-enrollments="reEnrollments"
        :selected-period="selectedPeriod"
      />
    </section>

    <div
      v-if="loading"
      class="flex items-center bg-bp_neutral-700 p-4 justify-center h-[15vh] w-full rounded-md"
    >
      <span class="loading loading-spinner loading-lg text-white"></span>
    </div>

    <section
      ref="sectionRef"
      tabindex="-1"
      v-if="!loading && !isEnrollmentPeriod && periodClasses.length > 0"
      class="bg-bp_neutral-700 rounded-md p-4 flex flex-col gap-2"
      :key="selectedPeriod"
    >
      <div
        v-if="
          !loading &&
          isReEnrollmentPeriod &&
          reEnrollments.length > 0 &&
          reEnrollments[0].ano == selectedPeriod.split('-')[0] &&
          reEnrollments[0].periodo == selectedPeriod.split('-')[1]
        "
        class="flex items-center justify-end gap-2 text-bp_neutral-400 text-sm"
      >
        <v-icon name="bi-clock" scale="1"></v-icon>
        <span
          >Última atualização:
          {{ formatProcessedDate(reEnrollments[0].data_processamento) }}
        </span>
      </div>
      <div class="grid md:grid-cols-3 bg-bp_neutral-700 rounded-md gap-4">
        <SubjectCard
          v-for="item in periodClasses"
          :key="item['id-turma']"
          class="w-full"
          :classSubject="item"
        />
        <EnrollmentCard
          v-if="
            isReEnrollmentPeriod &&
            reEnrollments.some(
              (e) =>
                e.ano == (selectedPeriod || '').split('-')[0] &&
                e.periodo == (selectedPeriod || '').split('-')[1]
            )
          "
          v-for="enrollment in reEnrollments"
          :key="`${enrollment['id-turma']}-${enrollment['codigo-componente']}-${
            enrollment.rematricula ? 'remat' : 'mat'
          }`"
          :enrollment="enrollment"
        />
      </div>
    </section>
    <div
      v-else-if="!loading && periodClasses.length === 0 && !isEnrollmentPeriod"
      class="relative bg-bp_grayscale-700 rounded-md min-h-[200px] max-h-[440px] overflow-y-auto p-2 flex flex-col w-full border border-bp_green-100/40"
    >
      <FriendInterests
        :periodo="selectedPeriod.split('-')[1]"
        :ano="selectedPeriod.split('-')[0]"
      />
      <VueDraggableNext
        id="interested-classes"
        :animation="800"
        class="grid md:grid-cols-3 gap-4 p-4 w-full h-full"
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
          class="w-full min-h-[160px] rounded-md flex flex-col items-center gap-4 p-4 text-vtd-secondary-100 border-4 border-dashed border-bp_grayscale-500 bg-bp_grayscale-800"
        >
          <v-icon
            name="bi-plus-circle"
            scale="2.6"
            class="text-bp_grayscale-500"
          ></v-icon>
          <div class="flex flex-col items-center">
            <span class="font-span font-medium">ARRASTE PARA ADICIONAR</span>
            <span class="font-span font-medium">NOVAS MATÉRIAS</span>
          </div>
        </div>
        <!-- Área de drop extra para quando há itens -->
        <div
          v-else
          class="w-full min-h-[40px]rounded-md flex items-center justify-center bg-transparent"
        >
          <span class="font-span font-medium text-vtd-secondary-100"> </span>
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
  </div>
</template>
