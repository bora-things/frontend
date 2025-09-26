<script setup>
import BpPagination from '@/components/BpPagination.vue'
import InputSearch from '@/components/InputSearch.vue'
import ListItemFriend from '@/components/ListItemFriend.vue'
import { computed, onMounted, ref } from 'vue'
import { getFriends } from './FriendsController'

const friends = ref([])
const currentPagination = ref(0)
const searchQuery = ref('')

const activeTab = ref('all')
const selectedCourse = ref('')
const selectedPeriod = ref('')

function updateCurrentPagination(newValue) {
  currentPagination.value = newValue
}

onMounted(async () => {
  const fetchedFriends = await getFriends()
  friends.value = fetchedFriends.map((f, index) => ({
    ...f,
    is_friend: index % 3 === 0
  }));
})

const totalFriendsCount = computed(() => {
  return friends.value.filter(friend => friend.is_friend === true).length;
});

const filteredFriends = computed(() => {
  currentPagination.value = 0;

  return friends.value.filter((friend) => {
    const matchesTab = 
      activeTab.value === 'all' || 
      (activeTab.value === 'my-friends' && friend.is_friend === true);

    const matchesCourse = 
      !selectedCourse.value || friend.degree === selectedCourse.value;

    const matchesPeriod =
      !selectedPeriod.value || friend.period.toString() === selectedPeriod.value;
      
    const matchesSearchQuery =
      !searchQuery.value ||
      friend.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      friend.id.toString().includes(searchQuery.value);

    return matchesTab && matchesCourse && matchesPeriod && matchesSearchQuery;
  });
});

const paginatedFriends = computed(() => {
  const start = currentPagination.value * 14
  const end = start + 14
  return filteredFriends.value.slice(start, end)
})

function clearFilters() {
  searchQuery.value = ''
  selectedCourse.value = ''
  selectedPeriod.value = ''
  activeTab.value = 'all'
  currentPagination.value = 0
}
</script>

<template>
    <main class="container mx-auto p-6 xl:max-w-7xl flex flex-col flex-1">
      <div class="container-search-friends">
        <h2 class="text-3xl font-bold border-b border-bp_neutral-800 pb-6 mb-6">Conecte-se com outros alunos</h2>
        <div class="space-y-6">
          <div>
              <form class="w-full lg:w-3/4">
                <InputSearch
                  v-model="searchQuery"
                />
              </form>
          </div>
          <div class="flex flex-wrap justify-between space-y-6 items-center">
            <div class="flex flex-wrap md:space-x-6 space-y-4 md:space-y-0">
              <div class="flex items-center bg-neutral-800 gap-2 border-2 border-bp_neutral-800 hover:border-bp_green-400 text-bp_green-400
                         py-2 px-4 rounded-lg transition-colors duration-600 ease-in-out">
                    <label for="curso-select" class="sr-only">Filtrar por Curso</label>
                    <v-icon name="md-school" scale="1.2"/>
                    <select v-model="selectedCourse" class="bg-bp_neutral-800 text-bp_white-100" name="curso" id="curso-select">
                        <option value="">Todos os Cursos</option>
                        <option value="cc">Ciência da Computação</option>
                        <option value="ti">Tecnologia da Informação</option>
                        <option value="c&t">C&T</option>
                    </select>
                </div>
                <div class="flex items-center bg-neutral-800 gap-2 border-2 border-bp_neutral-800 hover:border-bp_green-400 text-bp_green-400
                           py-2 px-4 rounded-lg transition-colors duration-600 ease-in-out">
                    <label for="periodo-select" class="sr-only">Filtrar por Período</label>
                    <v-icon name="md-calendartoday" scale="1"/>
                    <select v-model="selectedPeriod" class="bg-bp_neutral-800 text-bp_white-100" name="periodo" id="periodo-select">
                        <option value="">Todos os Períodos</option>
                        <option value="1">1º Período</option>
                        <option value="2">2º Período</option>
                    </select>
                </div>
            </div>
                <button 
                    @click="clearFilters" 
                    type="button" 
                    class="border-b-2 border-bp_neutral-800 hover:border-bp_green-400 items-center text-lg text-bp_green-400 px-2 transition-colors duration-500 ease-in-out">
                    <v-icon name="md-close" scale="1.2"/>  Limpar
                </button>
            </div>
        </div>

        <nav class="flex border-b-2 border-bp_grayscale-500 space-x-4 text-bp_grayscale-500">
            <button 
                @click="activeTab = 'all'"
                :class="['p-4', { 'border-b-2 border-bp_green-400 text-bp_green-400': activeTab === 'all' }]">
                Buscar Todos
            </button>
            <button 
                @click="activeTab = 'my-friends'"
                :class="['p-4', { 'border-b-2 border-bp_green-400 text-bp_green-400': activeTab === 'my-friends' }]">
                Meus Amigos ({{ totalFriendsCount }})
            </button>
        </nav>

        <div class="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
          <ListItemFriend v-for="friend in paginatedFriends" :key="friend.id" :friend="friend" />
        </div>
      </div>
      <div class="flex justify-center mt-12 pb-7">
        <BpPagination
          :current="currentPagination"
          @changeCurrentValue="updateCurrentPagination"
          :count="totalPages" />
      </div>
    </main>
</template>