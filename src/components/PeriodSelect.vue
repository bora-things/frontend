<template>
  <div class="flex flex-col items-start">
    <div class="flex flex-col">
      <div class="dropdown dropdown-hover">
        <div tabindex="0" role="button" class="m-1 title-h1 p-0 flex items-center gap-2">
          <template v-if="currentPeriodIsEnrollment">
            <v-icon name="bi-clipboard-check" scale="1.2" class="text-bp_green-400"></v-icon>
            Pedidos {{ currentPeriodLabel }}
          </template>
          <template v-else>
            {{ currentPeriodIndex + 1 }}º Período
          </template>
          <v-icon name="bi-chevron-down" scale="1.2"></v-icon>
        </div>
        <ul
          tabindex="0"
          class="title-h2 dropdown-content menu bg-bp_grayscale-700 rounded-box z-1 w-52 p-2 shadow-xl gap-1"
        >
          <li
            v-for="(period, index) in periods"
            :key="index"
            :class="[
              'hover:bg-bp_grayscale-800 p-2 rounded-md cursor-pointer',
              selectedPeriod == getPeriodKey(period) ? 'bg-bp_grayscale-800' : '',
              period.isEnrollment
                ? 'border-l-2 border-bp_green-400 bg-bp_green-500/5 hover:bg-bp_green-500/15'
                : period.interest
                ? 'border-r-2 border-bp_green-100/30 rounded-r-none hover:bg-bp_green-500/10 duration-300'
                : '',
            ]"
            @click="$emit('select-period', getPeriodKey(period))"
          >
            <template v-if="period.isEnrollment">
              <span class="leading-tight py-0 hover:bg-transparent hover:shadow-none flex items-center gap-2">
                <v-icon name="bi-clipboard-check" scale="1" class="text-bp_green-400"></v-icon>
                Pedidos
              </span>
              <span class="text-sm leading-tight hover:bg-transparent hover:shadow-none">
                {{ period.ano + "." + period.periodo }}
              </span>
            </template>
            <template v-else>
              <span class="leading-tight py-0 hover:bg-transparent hover:shadow-none">
                {{ getNonEnrollmentIndex(index) + 1 }}º Período
              </span>
              <span class="text-sm leading-tight hover:bg-transparent hover:shadow-none">
                {{ period.ano + "." + period.periodo }}
              </span>
            </template>
          </li>
          <li
            class="hover:bg-bp_grayscale-700 p-2 rounded-md cursor-pointer"
            @click="$emit('select-period', 'new')"
          >
            Novo Período
          </li>
        </ul>
      </div>
    </div>
    <span class="font-sans text-vtd-secondary-100">
      {{ displayPeriodLabel }}
    </span>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from "vue";
const props = defineProps({
  periods: Array,
  selectedPeriod: String,
});
const emit = defineEmits(["select-period"]);

const currentPeriodIsEnrollment = computed(() => {
  return props.selectedPeriod?.startsWith("enrollment-");
});

const currentPeriod = computed(() => {
  const [ano, periodo] = props.selectedPeriod.split("-").slice(-2);
  return props.periods.find((p) => p.ano == ano && p.periodo == periodo);
});

const currentPeriodLabel = computed(() => {
  if (currentPeriodIsEnrollment.value) {
    const [ano, periodo] = props.selectedPeriod.split("-").slice(-2);
    return `${ano}.${periodo}`;
  }
  return props.selectedPeriod.replace("-", ".");
});

const currentPeriodIndex = computed(() => {
  return props.periods
    .filter((p) => !p.isEnrollment)
    .findIndex(
      (item) =>
        item.ano == props.selectedPeriod.split("-")[0] &&
        item.periodo == props.selectedPeriod.split("-")[1]
    );
});

const displayPeriodLabel = computed(() => {
  if (currentPeriodIsEnrollment.value) {
    return `Pedidos ${currentPeriodLabel.value}`;
  }
  return props.selectedPeriod.replace("-", ".");
});

function getPeriodKey(period) {
  if (period.isEnrollment) {
    return `enrollment-${period.ano}-${period.periodo}`;
  }
  return `${period.ano}-${period.periodo}`;
}

function getNonEnrollmentIndex(index) {
  return props.periods.slice(0, index).filter((p) => !p.isEnrollment).length;
}
</script>
