<script setup>
import SubjectCardEC from "@/components/SubjectCardEC.vue";
import { computed, ref } from "vue";
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
});

const emit = defineEmits(["update:page"]);

const componentType = ref("TODAS");
const searchQuery = ref("");
const codeQuery = ref("");

const componentsFiltered = computed(() => {
  let filtered = props.components;
  if (componentType.value === "OBRIGATORIO") {
    filtered = filtered.filter((item) => item.component?.obrigatoria);
  } else if (componentType.value === "OPTATIVO") {
    filtered = filtered.filter((item) => !item.component?.obrigatoria);
  }
  if (searchQuery.value && searchQuery.value.trim() !== "") {
    const query = searchQuery.value.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.component?.nome && item.component.nome.toLowerCase().includes(query)) ||
        (item.component?.codigo && item.component.codigo.toLowerCase().includes(query))
    );
  }
  if (codeQuery.value && codeQuery.value.trim() !== "") {
    const code = codeQuery.value.trim().toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.component?.codigo && item.component.codigo.toLowerCase().includes(code)
    );
  }
  return filtered;
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
        <label
          class="input bg-bp_grayscale-600 border border-bp_grayscale-500 rounded-md flex items-center gap-2 p-2 w-[50%]"
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
        </label>
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
        <button
          class="join-item btn btn-ghost"
          v-if="page > 0"
          :class="page === page - 1 ? 'bg-bp_primary-600 text-white' : ''"
          @click="emit('update:page', page - 1)"
        >
          {{ page }}
        </button>
        <button class="join-item btn btn-ghost bg-bp_primary-600 text-white">
          {{ page + 1 }}
        </button>
        <button
          class="join-item btn btn-ghost"
          :class="page === page + 1 ? 'bg-bp_primary-600 text-white' : ''"
          @click="emit('update:page', page + 1)"
        >
          {{ page + 2 }}
        </button>
        <button
          class="join-item btn btn-ghost"
          :class="page === page + 2 ? 'bg-bp_primary-600 text-white' : ''"
          @click="emit('update:page', page + 2)"
        >
          {{ page + 3 }}
        </button>
        <button class="join-item btn btn-ghost" @click="handleFoward">{{ ">" }}</button>
      </div>
      <VueDraggableNext
        id="components"
        :animation="800"
        :list="components"
        class="grid md:grid-cols-3 grid-rows-3 gap-4"
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
    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardViewSubjects",
};
</script>
