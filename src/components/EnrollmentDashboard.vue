<script setup>
import EnrollmentCard from "@/components/EnrollmentCard.vue";
import { formatProcessedDate } from "@/utils/formatProcessedDate";
import { computed } from "vue";

const props = defineProps({
  enrollments: {
    type: Array,
    required: true,
  },
  reEnrollments: {
    type: Array,
    required: true,
  },
  selectedPeriod: {
    type: String,
    required: true,
  },
});

const currentPeriodEnrollments = computed(() => {
  if (!props.selectedPeriod.startsWith("enrollment-")) return [];

  const [, ano, periodo] = props.selectedPeriod.split("-");

  // Filtra enrollments normais do período
  const normalEnrollments = props.enrollments.filter(
    (e) => e.ano == parseInt(ano) && e.periodo == parseInt(periodo)
  );

  const reEnrollmentsMarked = props.reEnrollments
    .filter((e) => e.ano == parseInt(ano) && e.periodo == parseInt(periodo))
    .map((e) => ({ ...e, rematricula: true }));

  return [...normalEnrollments, ...reEnrollmentsMarked];
});

const processedDate = computed(() => {
  const enrollments = currentPeriodEnrollments.value;
  if (!enrollments.length) return null;

  const firstEnrollment = enrollments.find((e) => e.data_processamento);
  if (!firstEnrollment) return null;

  const dateString = firstEnrollment.data_processamento;
  return formatProcessedDate(dateString);
});
</script>

<template>
  <div class="col-span-full flex flex-col gap-4">
    <div
      v-if="processedDate"
      class="flex items-center justify-end gap-2 text-bp_neutral-400 text-sm"
    >
      <v-icon name="bi-clock" scale="1"></v-icon>
      <span>Última atualização: {{ processedDate }}</span>
    </div>

    <!-- Grid de cards -->
    <div class="grid md:grid-cols-3 gap-4">
      <EnrollmentCard
        v-for="enrollment in currentPeriodEnrollments"
        :key="`${enrollment['id-turma']}-${enrollment['codigo-componente']}-${
          enrollment.rematricula ? 'remat' : 'mat'
        }`"
        :enrollment="enrollment"
      />
    </div>
  </div>
</template>
