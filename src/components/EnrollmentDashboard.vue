<script setup>
import EnrollmentCard from "@/components/EnrollmentCard.vue";
import { computed } from "vue";

const props = defineProps({
  enrollments: {
    type: Array,
    required: true,
  },
  selectedPeriod: {
    type: String,
    required: true,
  },
});

// Extrai ano e período do selectedPeriod (formato: "enrollment-2026-1")
const currentPeriodEnrollments = computed(() => {
  if (!props.selectedPeriod.startsWith("enrollment-")) return [];

  const [, ano, periodo] = props.selectedPeriod.split("-");
  return props.enrollments.filter(
    (e) => e.ano == parseInt(ano) && e.periodo == parseInt(periodo)
  );
});
</script>

<template>
  <EnrollmentCard
    v-for="enrollment in currentPeriodEnrollments"
    :key="`${enrollment['id-turma']}-${enrollment['codigo-componente']}`"
    :enrollment="enrollment"
  />
</template>
