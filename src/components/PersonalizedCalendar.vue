<script setup>
import api from "@/config/axios.config.js";
import { computed, onMounted, ref } from "vue";

const events = ref({
  enrollment: [],
  reEnrollment: [],
  extraEnrollment: [],
  vacationEnrollment: [],
});

// Função para gerar array de datas entre duas datas
function getDateRange(startInstant, endInstant) {
  if (!startInstant || !endInstant) return [];

  const dates = [];
  // Converter timestamps Unix (em segundos) para milissegundos
  const startDate = new Date(startInstant * 1000);
  const endDate = new Date(endInstant * 1000);

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Função para processar os dados da API e converter para o formato esperado pelo calendário
function processCalendarData(apiData) {
  const processedEvents = {
    enrollment: [],
    reEnrollment: [],
    extraEnrollment: [],
    vacationEnrollment: [],
  };

  apiData.forEach((period) => {
    // Matrícula online
    if (period.onlineEnrollmentStart && period.onlineEnrollmentEnd) {
      processedEvents.enrollment.push(
        ...getDateRange(period.onlineEnrollmentStart, period.onlineEnrollmentEnd)
      );
    }

    // Rematrícula
    if (period.reEnrollmentStart && period.reEnrollmentEnd) {
      processedEvents.reEnrollment.push(
        ...getDateRange(period.reEnrollmentStart, period.reEnrollmentEnd)
      );
    }

    // Matrícula extraordinária
    if (period.extraordinaryEnrollmentStart && period.extraordinaryEnrollmentEnd) {
      processedEvents.extraEnrollment.push(
        ...getDateRange(
          period.extraordinaryEnrollmentStart,
          period.extraordinaryEnrollmentEnd
        )
      );
    }

    // Matrícula em disciplinas de férias
    if (period.vacationClassEnrollmentStart && period.vacationClassEnrollmentEnd) {
      processedEvents.vacationEnrollment.push(
        ...getDateRange(
          period.vacationClassEnrollmentStart,
          period.vacationClassEnrollmentEnd
        )
      );
    }
  });

  // Remover duplicatas e ordenar
  processedEvents.enrollment = [...new Set(processedEvents.enrollment)].sort();
  processedEvents.reEnrollment = [...new Set(processedEvents.reEnrollment)].sort();
  processedEvents.extraEnrollment = [...new Set(processedEvents.extraEnrollment)].sort();
  processedEvents.vacationEnrollment = [
    ...new Set(processedEvents.vacationEnrollment),
  ].sort();

  return processedEvents;
}

async function fetchCalendarEvents() {
  try {
    const response = await api.get("/api/calendars");
    const processedData = processCalendarData(response.data);
    events.value = processedData;
  } catch (error) {
    console.error("Erro ao buscar dados do calendário:", error);
  }
}

const today = new Date();
const currentMonth = ref(today.getMonth());
// Força o ano para 2025
const currentYear = ref(2025);

function getDaysInMonth(month, year) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

  const days = [];

  // Adicionar dias vazios do início do mês
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Adicionar os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

const days = computed(() => getDaysInMonth(currentMonth.value, currentYear.value));

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

function getEventClass(dateStr) {
  const applyClass = (dates, colorClass) => {
    if (!dates.includes(dateStr)) return "";
    return `${colorClass} text-white`;
  };

  if (dateStr === formatDate(today)) return "bg-bp_green-500 text-white rounded-full";

  return (
    applyClass(events.value.enrollment, "bg-bp_primary-700/50 rounded-full") ||
    applyClass(events.value.reEnrollment, "bg-bp_yellow-300/50 rounded-full") ||
    applyClass(events.value.extraEnrollment, "bg-bp_pink-100/50 rounded-full")
  );
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    if (currentYear.value > 2025) {
      currentYear.value--;
    }
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    if (currentYear.value < 2025) {
      currentYear.value++;
    }
  } else {
    currentMonth.value++;
  }
}

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

onMounted(() => {
  fetchCalendarEvents();
});
</script>

<template>
  <div className="dropdown dropdown-hover ">
    <button
      tabindex="0"
      disabled="true"
      class="relative bg-bp_grayscale-800 border border-bp_neutral-600 rounded-full w-12 h-12"
    >
      <v-icon class="p-2" name="md-calendartoday-round" scale="2" />
    </button>
    <ul
      tabIndex="{0}"
      className="dropdown-content mt-1 flex flex-col bg-bp_grayscale-700 p-4 rounded-md
       shadow-lg transition-all ease-in-out duration-300 w-80 md:w-96 max-h-[70vh] overflow-y-auto"
    >
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </h2>
          <div>
            <button @click="prevMonth">
              <v-icon name="md-keyboardarrowleft-round" scale="1.8" />
            </button>
            <button @click="nextMonth">
              <v-icon name="md-keyboardarrowright-round" scale="1.8" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-2 text-sm mb-2 text-center">
          <div
            v-for="(day, index) in weekDays"
            :key="index"
            class="font-bold text-gray-400"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 text-center">
          <template v-for="(day, index) in days" :key="index">
            <div
              v-if="day"
              :class="`p-2 my-1 w-8 h-8 flex items-center justify-center ${getEventClass(
                formatDate(day)
              )}`"
            >
              {{ day.getDate() }}
            </div>
            <div v-else class="p-2 my-1 w-8 h-8"></div>
          </template>
        </div>

        <div class="mt-4 flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_green-500"></span>
            <span>Dia Atual</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_primary-700/50"></span>
            <span>Matrícula</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_yellow-300/50"></span>
            <span>Rematrícula</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_pink-100/50"></span>
            <span>Extraordinária</span>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>
