<script setup>
import SubjectCardEC from "@/components/SubjectCardEC.vue";
import api from "@/config/axios.config";
import { computed, ref, watch } from "vue";
import { VueDraggableNext } from "vue-draggable-next";

const props = defineProps({
  components: {
    type: Array,
    required: true,
  },
  selectedPeriod: {
    type: String,
    required: true,
  },
  handleAddInterestedSubject: {
    type: Function,
    required: true,
  },
  handleRemoveInterestedSubject: {
    type: Function,
    required: true,
  },
  onMove: {
    type: Function,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  fetchComponents: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["update:page"]);

const componentType = ref("TODAS");
const searchQuery = ref("");
const codeQuery = ref("");
const loading = ref(false);

const componentsFiltered = computed(() => {
  let filtered = props.components;

  filtered = filtered.slice(props.page * 9, (props.page + 1) * 9);

  if (componentType.value === "OBRIGATORIO") {
    filtered = filtered.filter((item) => item.component?.obrigatoria);
  } else if (componentType.value === "OPTATIVO") {
    filtered = filtered.filter((item) => !item.component?.obrigatoria);
  }
  return filtered;
});

const totalPages = computed(() => {
  // Always use the filtered list for page count
  let filtered = props.components;
  if (componentType.value === "OBRIGATORIO") {
    filtered = filtered.filter((item) => item.component?.obrigatoria);
  } else if (componentType.value === "OPTATIVO") {
    filtered = filtered.filter((item) => !item.component?.obrigatoria);
  }
  return Math.ceil(filtered.length / 9);
});

function handleFoward() {
  emit("update:page", props.page + 1);
}
function handleBack() {
  emit("update:page", props.page > 0 ? props.page - 1 : 0);
}

function toggleComponentType(type) {
  if (componentType.value === type) {
    componentType.value = "TODAS";
  } else {
    componentType.value = type;
  }
}

function handleSearchInput(e) {
  searchQuery.value = e.target.value;
}
function handleCodeInput(e) {
  codeQuery.value = e.target.value;
}

async function fetchSearchedComponents(e) {
  e.preventDefault();
  try {
    loading.value = true;
    const response = await api.get("/api/components", {
      params: {
        searched: searchQuery.value,
      },
    });
    emit("searched-components", response.data); // Emite para o pai atualizar a lista
  } catch (error) {
    console.error("Error fetching components:", error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => searchQuery.value,
  (newQuery) => {
    if (newQuery === "") {
      props.fetchComponents();
    }
  }
);
</script>

<template>
  <div class="flex flex-col flex-1">
    <div class="flex items-center justify-between w-full lg:flex-row gap-3">
      <div class="flex flex-col md:flex-row md:justify-between items-center gap-5">
        <p class="text-3xl font-bold">Disciplinas</p>
      </div>
      <div
        class="flex justify-between items-center space-x-4 p-2 rounded-xl bg-bp_neutral-700 w-[80%]"
      >
        <form :onsubmit="fetchSearchedComponents" class="w-full">
          <label
            class="w-full input bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md flex items-center gap-2 p-2 w-[50%]"
          >
            <input
              type="search"
              placeholder="Buscar com IA"
              class="text-bp_grayscale-400 font-sans"
              :value="searchQuery"
              @input="handleSearchInput"
            />
            <v-icon
              name="bi-stars"
              scale="1.2"
              class="hover:animate-twinkle cursor-pointer"
            ></v-icon>
            <button type="submit">
              <v-icon
                name="bi-search"
                scale="1.2"
                class="hover:scale-[1.05] cursor-pointer"
              ></v-icon>
            </button>
          </label>
        </form>
        <div
          class="flex items-center space-x-2 bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md p-2"
        >
          <label
            class="bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md flex items-center gap-2 w-[60%] pr-2"
          >
            <input
              type="search"
              placeholder="Buscar por código"
              class="pl-2 text-sm py-1 text-bp_grayscale-400 rounded-3xl bg-transparent font-sans focus:outline-none"
              :value="codeQuery"
              @input="handleCodeInput"
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
            @click="() => toggleComponentType('OBRIGATORIO')"
          >
            Obrigatório
          </button>
          <button
            :class="[
              'badge text-white py-2 bg-transparent rounded-xl border border-bp_primary-600',
              componentType === 'OPTATIVO' ? 'bg-bp_primary-600' : '',
            ]"
            @click="() => toggleComponentType('OPTATIVO')"
          >
            Optativo
          </button>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col items-center bg-bp_grayscale-600 rounded-md gap-4 p-4 flex-1"
    >
      <div class="join bg-transparent text-gray-300">
        <button class="join-item btn btn-ghost" :disabled="page == 0" @click="handleBack">
          {{ "<" }}
        </button>
        <span v-if="page > 1" class="join-item btn btn-ghost select-none opacity-30"
          >...</span
        >
        <button
          v-if="page > 0"
          class="join-item btn btn-ghost"
          @click="emit('update:page', page - 1)"
        >
          {{ page }}
        </button>
        <button class="join-item btn btn-ghost bg-bp_primary-600 text-white">
          {{ page + 1 }}
        </button>
        <button
          v-if="page < totalPages - 1"
          class="join-item btn btn-ghost"
          @click="emit('update:page', page + 1)"
        >
          {{ page + 2 }}
        </button>
        <span
          v-if="page < totalPages - 2"
          class="join-item btn btn-ghost select-none opacity-30"
          >...</span
        >
        <button
          class="join-item btn btn-ghost"
          :disabled="page >= totalPages - 1"
          @click="handleFoward"
        >
          {{ ">" }}
        </button>
      </div>
      <div
        v-if="componentsFiltered.length === 0 && !loading"
        class="text-center text-gray-400"
      >
        Nenhuma disciplina encontrada.
      </div>
      <VueDraggableNext
        v-if="!loading && props.components.length > 0"
        id="components"
        :animation="800"
        :list="components"
        class="grid md:grid-cols-3 grid-rows-3 gap-4 w-full h-full"
        group="subjects"
        :move="onMove"
        @add="handleRemoveInterestedSubject"
        @remove="handleAddInterestedSubject"
      >
        <SubjectCardEC
          class="w-full"
          v-for="classe in componentsFiltered"
          :key="classe.component.codigo"
          :component="classe.component"
          :period="selectedPeriod"
        />
      </VueDraggableNext>
      <div v-else-if="loading" class="flex items-center justify-center h-full">
        <span class="loading loading-spinner"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardViewSubjects",
};
</script>
