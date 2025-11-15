<script setup>
import { capitalizeText } from "@/utils/capitalizeText";
import { computed } from "vue";

const props = defineProps({
  enrollment: {
    type: Object,
    required: true,
  },
});

const {
  rank,
  capacidade,
  incerto,
  rematricula,
  concorrencia,
  vagas_restantes,
} = props.enrollment;

const enrollmentStatus = computed(() => {
  const withinCapacity = rematricula ? rank <= vagas_restantes : rank <= capacidade;
  const isUncertain = incerto;

  if (withinCapacity && !isUncertain) {
    return {
      canEnroll: true,
      message: "Possível entrada",
      color: "text-bp_green-200",
      bgColor: "bg-bp_green-500/20",
      icon: "bi-check-circle-fill",
    };
  }

  if (isUncertain) {
    return {
      canEnroll: null,
      message: "Incerto",
      color: "text-yellow-200",
      bgColor: "bg-yellow-500/20",
      icon: "bi-hourglass-split",
    };
  }

  return {
    canEnroll: false,
    message: "Entrada improvável",
    color: "text-red-200",
    bgColor: "bg-red-500/20",
    icon: "bi-x-circle-fill",
  };
});
</script>

<template>
  <div
    class="bg-bp_grayscale-800 border-bp_grayscale-500 border w-full h-[180px] rounded-md flex flex-col justify-between gap-6 p-4 text-vtd-secondary-100 cursor-pointer hover:bg-bp_grayscale-700 transition-colors duration-200"
  >
    <!-- Header com nome e status -->
    <div class="flex items-start gap-2">
      <div class="flex-1 flex items-start gap-2">
        <h3 class="font-sans font-medium">
          {{ capitalizeText(enrollment.componente.nome) }}
        </h3>
        <span
          v-if="enrollment.rematricula"
          class="bg-bp_primary-400/20 text-bp_primary-400 px-3 py-1 rounded text-xs font-medium flex items-center gap-1 shrink-0"
        >
          <v-icon name="bi-arrow-repeat" scale="0.7"></v-icon>
          Rematrícula
        </span>
      </div>
      <div>
        <div
          :class="[
            'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
            enrollmentStatus.bgColor,
            enrollmentStatus.color,
          ]"
        >
          <v-icon :name="enrollmentStatus.icon" scale="0.9"></v-icon>
          {{ enrollmentStatus.message }}
        </div>
      </div>
    </div>

    <!-- Status badge -->
    <div class="flex justify-between items-end">
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded">
          <span class="text-bp_neutral-400 text-xs block mb-1">
            {{ enrollment.incerto ? "Concorrência" : "Posição" }}
          </span>
          <p class="text-white font-bold text-sm">
            {{ enrollment.incerto ? enrollment.concorrencia : `${enrollment.rank}º` }}
          </p>
        </div>
        <div class="rounded">
          <span class="text-bp_neutral-400 text-xs block mb-1">
            {{ enrollment.incerto || enrollment.rematricula ? "Vagas " : "Capacidade" }}
          </span>
          <p class="text-white font-bold text-sm">
            {{
              enrollment.incerto || enrollment.rematricula
                ? enrollment.vagas_restantes
                : enrollment.capacidade
            }}
          </p>
        </div>
      </div>
      <div class="flex flex-col gap-2 items-end">
        <span
          class="font-sans badge border-bp_grayscale-500 flex items-center justify-center bg-transparent border text-vtd-secondary-100"
        >
          {{ enrollment.componente.codigo }}
        </span>
        <div class="flex gap-2">
          <span
            :class="[
              'font-sans badge text-vtd-secondary-100 bg-transparent border',
              enrollment.componente['deisciplina-obrigatoria']
                ? 'border-bp_green-600'
                : 'border-sky-600',
            ]"
            >{{
              enrollment.componente["disciplina-obrigatoria"] ? "OBRIGATÓRIO" : "OPTATIVO"
            }}</span
          >
          <span
            class="font-sans badge border-bp_grayscale-500 flex items-center justify-center bg-transparent border text-vtd-secondary-100"
          >
            {{ enrollment.componente["carga-horaria-total"] }}H</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
