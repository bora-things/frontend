<script setup>
import { ref, onMounted, computed } from 'vue';
import CardSubjects from '@/components/CardSubjects.vue';
import InputSearch from '@/components/InputSearch.vue';
import { getSubjects } from './ConsultSubjectsController';

const subjects = ref([]);
const searchQuery = ref('');
const selectedDepartment = ref('Departamento');
const selectedDifficulty = ref('Dificuldade');
const selectedWorkload = ref('Horas');

onMounted(async () => {
  subjects.value = await getSubjects();
});

const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

const filteredSubjects = computed(() => {
  return subjects.value.filter(subject => {
    const matchesDepartment = selectedDepartment.value === 'Departamento' 
      || subject.department === selectedDepartment.value;

    const matchesDifficulty = selectedDifficulty.value === 'Dificuldade' 
      || subject.difficulty === selectedDifficulty.value;

    const matchesWorkload = selectedWorkload.value === 'Horas' 
      || subject.workload === selectedWorkload.value;

    const matchesSearchQuery = !searchQuery.value 
      || subject.name.toLowerCase().includes(searchQuery.value.toLowerCase()) 
      || subject.code.toLowerCase().includes(searchQuery.value.toLowerCase());

    return matchesDepartment && matchesDifficulty && matchesWorkload && matchesSearchQuery;
  });
});

const clearFilters = () => {
  searchQuery.value = '';
  selectedDepartment.value = 'Departamento';
  selectedDifficulty.value = 'Dificuldade';
  selectedWorkload.value = 'Horas';
};

</script>

<template>
  <div class="h-full w-full">
    <main class="h-full container mx-auto p-6 xl:max-w-7xl bg-bp_neutral-900 space-y-6">
      <p class="text-bp_neutral-50 text-3xl font-bold">consultar-disciplinas</p>
      <hr class="border-bp_neutral-700" />
      <div class="flex flex-col lg:flex-row lg:space-x-6">
        
        <InputSearch
        @search="updateSearchQuery"
        v-model="searchQuery" class="w-full lg:w-2/3 mb-4 lg:mb-0" />
        <div class="flex flex-wrap justify-end lg:w-1/2 space-x-4">
          <div class="flex items-center space-x-2">
            <select v-model="selectedDepartment" class="card-options text-lg">
              <option hidden value="Departamento">Departamento</option>
              <option value="IMD">IMD</option>
              <option value="C&T">C&T</option>
              <option value="DIMAP">DIMAP</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <select v-model="selectedDifficulty" class="card-options text-lg">
              <option hidden value="Dificuldade">Dificuldade</option>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <select v-model="selectedWorkload" class="card-options text-lg">
              <option hidden value="Horas">Horas</option>
              <option value="30">30h</option>
              <option value="60">60h</option>
              <option value="90">90h</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button 
              @click="clearFilters"
              class="card-options">
              Limpar Filtros
            </button>
        </div>
        </div>
      </div>
      <div class="space-y-4">
        <CardSubjects
          v-for="subject in filteredSubjects"
          :key="subject.code"
          :subject="subject"
        />
      </div>
    </main>
  </div>
</template>
