<script setup>
import SubjectCard from "@/components/SubjectCard.vue";
import SubjectCardEC from "@/components/SubjectCardEC.vue";
import api from "@/config/axios.config";
import { computed, onMounted, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
import {
  handleAddInterestedSubjectRequest,
  handleRemoveInterestedSubjectRequest,
  handleInterestedSubjectsRequest,
} from "./DashboardController.js";

const components = ref([
  {
    nome: "CÁLCULO DIFERENCIAL E INTEGRAL I",
    "carga-horaria-total": 90,
    "co-requisites": null,
    "pre-requisites": null,
    codigo: "IMD0046",
    blockComponents: null,
    departamento: null,
    "tipo-atividade-descricao": null,
    "disciplina-obrigatoria": true,
    ementa: null,
    equivalentes: null,
    "id-componente": 1,
    "id-matriz-curricular": null,
    "id-tipo-atividade": null,
    "id-tipo-componente": null,
    "id-unidade": null,
  },
]);

const classes = ref(null);
const loading = ref(true);
const selectedClasses = ref([]);
const periods = ref([]);
const interestedClasses = ref([]);
const componentsFiltered = ref([...components.value]);
const searchQuery = ref("");
const selectedPeriod = ref("");

const componentType = ref("TODAS");

const selectedPeriodWorkload = computed(() => {
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

watch(components, (newValue) => {
  componentsFiltered.value = newValue;
});

function selectPeriod(period) {
  if (period == "new") {
    const lastPeriod = periods.value[periods.value.length - 1];
    const newPeriod = lastPeriod.periodo == 1 ? 2 : 1;
    const newYear = lastPeriod.periodo == 2 ? Number(lastPeriod.ano) + 1 : lastPeriod.ano;
    periods.value.push({ ano: newYear, periodo: newPeriod });
    selectedPeriod.value = newYear + "-" + newPeriod;
    interestedClasses.value[selectedPeriod.value] = [];
    return;
  }
  selectedPeriod.value = period;
}

async function fetchClasses() {
  try {
    const response = await api.get("/api/classrooms/me");
    const data = response.data.filter((item) => item.component);
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
    return { ano, periodo };
  });
  const interestedPeriods = Object.keys(interestedClasses.value).map((key) => {
    const [ano, periodo] = key.split("-");
    return { ano, periodo };
  });

  const allPeriods = [...classesPeriods, ...interestedPeriods];
  periods.value = allPeriods;
}

async function fetchInterestedClasses() {
  try {
    const data = await handleInterestedSubjectsRequest();
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
    console.error("Erro ao buscar disciplinas de interesse:", error);
  }
}

onMounted(async () => {
  await Promise.all([fetchClasses(), fetchInterestedClasses()]);
  await setPeriods();
  selectPeriod(periods.value[0].ano + "-" + periods.value[0].periodo);
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

function toggleComponentType(type) {
  if (componentType.value === type) {
    componentType.value = "TODAS"; // Reseta para "TODAS" se o mesmo botão for clicado novamente
  } else {
    componentType.value = type; // Define o tipo selecionado
  }
}

async function handleRemoveInterestedSubject(component) {
  await handleRemoveInterestedSubjectRequest(component.codigo);
  interestedClasses.value[selectedPeriod.value] = interestedClasses.value[
    selectedPeriod.value
  ].filter((item) => item.component.codigo != component.codigo);
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
}

async function handleAddInterestedSubject(component) {
  interestedClasses.value[selectedPeriod.value] = [
    ...(interestedClasses.value[selectedPeriod.value] || []),
    {
      component,
      disabled: true,
      "id-turma": component.codigo,
      interest_id: component.codigo,
    },
  ];

  await handleAddInterestedSubjectRequest({
    subjectCode: component.codigo,
    period: selectedPeriod.value.split("-")[1],
    year: selectedPeriod.value.split("-")[0],
  });
}

async function onDragEnd(event) {
  const fromSection = event.from.id;
  const item = event.item;
  if (!item.id) return;
  const component = components.value.find((component) => component.codigo === item.id);
  if (!component) return;
  if (fromSection === "interested-classes") {
    await handleRemoveInterestedSubject(component);
  } else {
    await handleAddInterestedSubject(component);
  }
  fetchInterestedClasses();
}
</script>

<template>
  <main class="container mx-auto p-6 xl:max-w-7xl flex flex-col flex-1">
    <header class="flex items-center justify-between pb-4">
      <div class="flex flex-col items-start">
        <div class="flex flex-col">
          <div className="dropdown dropdown-hover">
            <div
              tabIndex="{0}"
              role="button"
              className=" m-1 title-h1 p-0 flex items-center gap-2 "
            >
              {{
                periods.findIndex(
                  (item) =>
                    item.ano == selectedPeriod.split("-")[0] &&
                    item.periodo == selectedPeriod.split("-")[1]
                ) + 1
              }}º Período
              <v-icon name="bi-chevron-down" scale="1.2"></v-icon>
            </div>
            <ul
              tabIndex="{0}"
              className="title-h2 dropdown-content menu bg-bp_grayscale-600 rounded-box z-1 w-52 p-2 shadow-sm gap-1"
            >
              <li
                :class="[
                  'hover:bg-bp_grayscale-700 p-2 rounded-md cursor-pointer',
                  selectedPeriod == `${period.ano}-${period.periodo}`
                    ? 'bg-bp_grayscale-700'
                    : '',
                ]"
                v-for="(period, index) in periods"
                :key="index"
                @click="selectPeriod(`${period.ano}-${period.periodo}`)"
              >
                {{ index + 1 }}º Período
              </li>
              <li
                class="hover:bg-bp_grayscale-700 p-2 rounded-md cursor-pointer"
                @click="selectPeriod('new')"
              >
                Novo Período
              </li>
            </ul>
          </div>
        </div>
        <span class="font-sans text-vtd-secondary-100">{{
          selectedPeriod.replace("-", ".")
        }}</span>
      </div>

      <div className="tooltip">
        <div className="tooltip-content text-xl tooltip-error tooltip-bottom">
          <div className="text-white ">
            <span>Limite alcançado</span>
          </div>
        </div>
        <span class="title-h2"> {{ selectedPeriodWorkload }}h </span>
      </div>
    </header>

    <div
      v-if="loading"
      class="flex items-center bg-bp_grayscale-600 p-4 justify-center h-[15vh] w-full rounded-md"
    >
      <span class="loading loading-spinner loading-lg text-white"></span>
    </div>
    <section
      v-if="!loading && periodClasses.length > 0"
      class="grid md:grid-cols-3 bg-bp_grayscale-600 rounded-md gap-4 p-4"
      :key="selectedPeriod"
    >
      <SubjectCard
        v-for="item in periodClasses"
        :key="item['id-turma']"
        class="w-full"
        :classSubject="item"
      />
    </section>
    <VueDraggableNext
      v-else-if="!loading && periodClasses.length === 0"
      id="interested-classes"
      :animation="800"
      class="grid md:grid-cols-3 bg-bp_grayscale-600 rounded-md gap-4 p-4"
      @end="onDragEnd"
      group="subjects"
      :key="periodInterestedClasses.map((item) => item.interest_id).join(',')"
    >
      <SubjectCard
        v-for="item in periodInterestedClasses"
        :key="item.interest_id"
        class="w-full"
        :classSubject="item"
        :disabled="item.disabled"
      />
      <div
        v-for="_ in [1]"
        class="bg-bp_grayscale-800 w-full h-[160px] rounded-md flex flex-col items-center gap-4 p-4 text-vtd-secondary-100 border border-dashed border-[3px] border-bp_grayscale-500"
      >
        <v-icon name="bi-plus-circle" scale="2.6" class="text-bp_grayscale-500"></v-icon>
        <div class="flex flex-col items-center">
          <span class="font-span font-medium">ARRASTE PARA ADICIONAR</span>
          <span class="font-span font-medium">NOVAS MATÉRIAS</span>
        </div>
      </div>
    </VueDraggableNext>
    <hr class="my-6 border-bp_grayscale-700" />
    <div class="flex flex-col flex-1">
      <div class="flex items-center justify-between w-full lg:flex-row gap-3">
        <div class="flex flex-col md:flex-row md:justify-between items-center gap-5">
          <p class="text-3xl font-bold">Disciplinas</p>
        </div>
        <div
          class="flex justify-between items-center space-x-4 p-2 rounded-xl bg-bp_neutral-700 w-[80%]"
        >
          <label
            className="input bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md flex items-center gap-2 p-2 w-[50%]"
          >
            <input
              type="search"
              placeholder="Buscar com IA"
              class="text-bp_grayscale-400 font-sans"
            />
            <v-icon
              name="bi-stars"
              scale="1.2"
              class="hover:animate-twinkle cursor-pointer"
            ></v-icon>
          </label>
          <div
            class="flex items-center space-x-2 bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md p-2"
          >
            <label
              className="bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md flex items-center gap-2 w-[60%] pr-2"
            >
              <input
                type="search"
                placeholder="Buscar por código"
                class="pl-2 text-sm py-1 text-bp_grayscale-400 rounded-3xl bg-transparent font-sans focus:outline-none"
              />
              <v-icon
                name="bi-search"
                class="hover:scale-[1.1] cursor-pointer duration-300"
              ></v-icon>
            </label>
            <button
              :class="[
                'badge text-white py-2 bg-transparent rounded-xl border border-bp_green-600',
                componentType === 'OBRIGATORIO' ? 'bg-bp_green-600' : '',
              ]"
              @click="toggleComponentType('OBRIGATORIO')"
            >
              Obrigatório
            </button>
            <button
              :class="[
                'badge text-white py-2 bg-transparent rounded-xl border border-bp_primary-600',
                componentType === 'OPTATIVO' ? 'bg-bp_primary-600' : '',
              ]"
              @click="toggleComponentType('OPTATIVO')"
            >
              Optativo
            </button>
          </div>
        </div>
      </div>

      <VueDraggableNext
        id="components"
        :animation="800"
        :list="componentsFiltered"
        class="grid md:grid-cols-3 md:grid-rows-3 bg-bp_grayscale-600 rounded-md gap-4 p-4 flex-1"
        group="subjects"
        @end="onDragEnd"
        key="semester"
      >
        <SubjectCardEC
          class="w-full"
          v-for="component in componentsFiltered"
          :key="component.codigo"
          :component="component"
          :period="selectedPeriod"
        />
      </VueDraggableNext>
    </div>
  </main>
</template>
