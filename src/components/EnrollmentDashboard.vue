<script setup>
import EnrollmentCard from "@/components/EnrollmentCard.vue";
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
</script>

<template>
  <EnrollmentCard
    v-for="enrollment in currentPeriodEnrollments"
    :key="`${enrollment['id-turma']}-${enrollment['codigo-componente']}-${
      enrollment.rematricula ? 'remat' : 'mat'
    }`"
    :enrollment="enrollment"
  />
</template>
