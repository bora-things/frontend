<script setup>
import { defineEmits, defineProps, nextTick, onMounted, ref, watch } from "vue";

const props = defineProps({
  periods: Array,
  selectedPeriod: String,
});

defineEmits(["select-period"]);

const carouselRef = ref(null);

const getPeriodKey = (period) => {
  if (period.isEnrollment) {
    return `enrollment-${period.ano}-${period.periodo}`;
  }
  return `${period.ano}-${period.periodo}`;
};

const getPeriodClasses = (period) => {
  const periodKey = getPeriodKey(period);
  const isSelected = props.selectedPeriod === periodKey;

  return {
    "bg-bp_green-600 border-bp_green-600 text-white shadow-lg": isSelected,
    "border-l-4 border-l-bp_green-400 bg-bp_green-500/5 hover:bg-bp_green-500/15 border-bp_green-400":
      !isSelected && period.isEnrollment,
    "border-r-4 border-r-bp_green-100/50 bg-bp_grayscale-700 border-bp_grayscale-600 hover:bg-bp_grayscale-600 hover:border-bp_grayscale-500":
      !isSelected && !period.interest && !period.isEnrollment,
    "border-2 border-dashed border-bp_green-600 hover:bg-bp_grayscale-700 hover:text-white transition-colors duration-200":
      period.interest && !isSelected && !period.isEnrollment,
  };
};

const scrollLeft = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: -300, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (carouselRef.value) {
    carouselRef.value.scrollBy({ left: 300, behavior: "smooth" });
  }
};

const scrollToEnd = () => {
  if (carouselRef.value) {
    const maxScroll = carouselRef.value.scrollWidth - carouselRef.value.clientWidth;
    carouselRef.value.scrollLeft = maxScroll;
  }
};

// Sempre rola para o final (direita) ao montar o componente
onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    scrollToEnd();
  }, 300);
});

// Observa mudanças nos períodos e rola para o final
watch(
  () => props.periods,
  async () => {
    await nextTick();
    setTimeout(() => {
      scrollToEnd();
    }, 300);
  },
  { deep: true }
);
</script>

<template>
  <div class="relative w-[90%] flex items-center gap-2">
    <button
      v-if="periods.length > 3"
      @click="scrollLeft"
      class="btn btn-circle btn-outline btn-sm bg-bp_grayscale-700 border-bp_grayscale-600 hover:bg-bp_grayscale-600 hover:text-white hover:scale-105"
    >
      <v-icon name="bi-chevron-left" scale="1" />
    </button>

    <div
      ref="carouselRef"
      class="flex items-center gap-3 overflow-x-auto scroll-smooth px-2"
      :class="{ 'px-0': !periods || periods.length <= 3 }"
      style="scrollbar-width: none; -ms-overflow-style: none"
    >
      <div
        v-for="(period, index) in periods"
        :key="index"
        class="flex-shrink-0"
        :class="{
          'tooltip tooltip-bottom tooltip-success': period.isEnrollment,
        }"
        :data-tip="period.isEnrollment ? 'Período de Solicitação de Matrícula' : ''"
      >
        <button
          class="flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-colors duration-200 md:min-w-[90px]"
          :class="getPeriodClasses(period)"
          @click="$emit('select-period', getPeriodKey(period))"
        >
          <span class="font-bold text-sm leading-tight">{{ index + 1 }}º Período</span>
          <span class="text-xs leading-tight">{{ period.ano }}.{{ period.periodo }}</span>
        </button>
      </div>

      <button
        v-if="periods && periods.length > 0"
        class="flex-shrink-0 flex items-center justify-center gap-2 p-2 rounded-lg border-2 border-dashed border-bp_grayscale-500 text-bp_grayscale-300 hover:bg-bp_grayscale-700 hover:text-white transition-colors duration-200 md:min-w-[90px] h-[45px]"
        @click="$emit('select-period', 'new')"
      >
        <v-icon name="bi-plus-lg" scale="1.1" />
        <span class="font-bold leading-tight">Novo</span>
      </button>
    </div>

    <button
      v-if="periods && periods.length > 3"
      @click="scrollRight"
      class="btn btn-circle btn-outline btn-sm bg-bp_grayscale-700 border-bp_grayscale-600 hover:bg-bp_grayscale-600 hover:text-white hover:scale-105"
    >
      <v-icon name="bi-chevron-right" scale="1" />
    </button>
  </div>
</template>
