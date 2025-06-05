<script setup>
import { computed, onMounted, ref } from "vue";

const isCalendarOpen = ref(false);

const events = ref({
  enrollment: [],
  reEnrollment: [],
  extraEnrollment: [],
});

async function fetchCalendarEvents() {
  try {
    const response = await fetch("src/assets/mocks/CalendarMockData.json");
    const data = await response.json();
    events.value = data;
  } catch (error) {
    console.error("Erro ao buscar dados do calendário:", error);
  }
}

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());

function handleCalendarClick() {
  isCalendarOpen.value = !isCalendarOpen.value;
}

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
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

    const isFirst = dateStr === dates[0];
    const isLast = dateStr === dates[dates.length - 1];

    const borderRadius = isFirst ? "rounded-l-md" : isLast ? "rounded-r-md" : "";
    const borderSide = [
      isFirst ? "border-l" : "",
      isLast ? "border-r" : "",
      "border-t",
      "border-b",
    ].join(" ");

    return `text-white ${borderSide} ${colorClass} ${borderRadius}`;
  };

  if (dateStr === formatDate(today)) return "text-bp_green-500 font-bold";

  return (
    applyClass(events.value.enrollment, "border-bp_primary-700") ||
    applyClass(events.value.reEnrollment, "border-bp_yellow-300") ||
    applyClass(events.value.extraEnrollment, "border-bp_pink-100")
  );
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
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
  <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
    <button
      tabindex="0"
      class="relative bg-bp_grayscale-800 border border-bp_neutral-600 rounded-full w-12 h-12"
    >
      <v-icon class="p-2" name="md-calendartoday-round" scale="2" />
    </button>
    <ul
      tabIndex="{0}"
      className="dropdown-content flex flex-col bg-bp_grayscale-800 p-4 rounded-md
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
            <div :class="`p-2 my-1 ${getEventClass(formatDate(day))}`">
              {{ day.getDate() }}
            </div>
          </template>
        </div>

        <div class="mt-4 flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Dia Atual</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_primary-700"></span>
            <span>Matrícula</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_yellow-300"></span>
            <span>Rematrícula</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-full bg-bp_pink-100"></span>
            <span>Extraordinária</span>
          </div>
        </div>
      </div>
    </ul>
  </div>
</template>
