<script setup>
import BpPagination from "@/components/BpPagination.vue";
import InputSearch from "@/components/InputSearch.vue";
import ListItemFriend from "@/components/ListItemFriend.vue";
import { computed, onMounted, ref, watch } from "vue";
import { getFriends, getGeneralPeople } from "./FriendsController";

// Arrays separados para pessoas gerais e amigos
const generalPeople = ref([]);
const friends = ref([]);

// Estado separado para cada aba
const tabsState = ref({
  all: {
    data: [],
    searchQuery: "",
    currentPagination: 0,
    totalPages: 0,
    totalElements: 0,
    isLoaded: false,
    isLoading: false,
  },
  "my-friends": {
    data: [],
    searchQuery: "",
    currentPagination: 0,
    totalPages: 0,
    totalElements: 0,
    isLoaded: false,
    isLoading: false,
  },
});

const activeTab = ref("all");

// Getters computados para a aba ativa
const currentTabState = computed(() => tabsState.value[activeTab.value]);
const searchQuery = computed({
  get: () => {
    const query = currentTabState.value?.searchQuery;
    return typeof query === "string" ? query : "";
  },
  set: (value) => {
    if (currentTabState.value) {
      currentTabState.value.searchQuery = typeof value === "string" ? value : "";
    }
  },
});
const currentPagination = computed({
  get: () => currentTabState.value.currentPagination,
  set: (value) => (currentTabState.value.currentPagination = value),
});
const totalPages = computed(() => currentTabState.value.totalPages);
const totalElements = computed(() => currentTabState.value.totalElements);
const isLoading = computed(() => currentTabState.value.isLoading);

const totalFriendsCount = ref(0);

async function updateCurrentPagination(newValue) {
  currentPagination.value = newValue;
  await loadData();
}

// Função para mapear o status de amizade
function mapFriendStatus(friendStatus) {
  const statusMap = {
    FRIENDS: "friends",
    NOT_FRIENDS: "not_friends",
    REQUEST_SENT: "pending_sent",
    REQUEST_RECEIVED: "pending_received",
  };
  return statusMap[friendStatus] || "not_friends";
}

// Função para carregar pessoas gerais
async function loadGeneralPeople() {
  const tabState = tabsState.value.all;
  tabState.isLoading = true;

  try {
    const params = {
      page: currentPagination.value, // Usar o computed ao invés de tabState.currentPagination
      size: 8,
    };

    // Usar o computed searchQuery ao invés do tabState.searchQuery
    const query = searchQuery.value;

    if (query && typeof query === "string" && query.trim()) {
      params.studentName = query.trim();
    } else {
    }

    const response = await getGeneralPeople(params);

    // Mapear os dados para o formato esperado pelo frontend
    const mappedData = response.content.map((person) => ({
      id: person.id,
      nome: person.studentName || "Nome não informado",
      curso: person.courseName || "Curso não informado",
      periodo: person.period || 0,
      status: mapFriendStatus(person.friendStatus),
      imageUrl: person.imageUrl,
      requestId: person.requestId,
    }));

    tabState.data = mappedData;
    tabState.totalPages = response.totalPages;
    tabState.totalElements = response.totalElements;
    tabState.isLoaded = true;
  } catch (error) {
    tabState.data = [];
    tabState.totalPages = 0;
    tabState.totalElements = 0;
  } finally {
    tabState.isLoading = false;
  }
}

// Função para carregar amigos
async function loadFriends() {
  const tabState = tabsState.value["my-friends"];
  tabState.isLoading = true;

  try {
    const params = {
      page: currentPagination.value, // Usar o computed ao invés de tabState.currentPagination
      size: 8,
    };

    // Usar o computed searchQuery ao invés do tabState.searchQuery
    const query = searchQuery.value;

    if (query && typeof query === "string" && query.trim()) {
      params.studentName = query.trim();
    } else {
    }

    const response = await getFriends(params);

    const mappedData = response.content.map((friend) => ({
      id: friend.id,
      nome: friend.studentName || "Nome não informado",
      curso: friend.courseName || "Curso não informado",
      periodo: friend.period || 0,
      status: mapFriendStatus(friend.friendStatus),
      imageUrl: friend.imageUrl,
      requestId: friend.requestId,
    }));

    tabState.data = mappedData;
    tabState.totalPages = response.totalPages;
    tabState.totalElements = response.totalElements;
    tabState.isLoaded = true;

    // Atualizar contador total de amigos
    if (totalFriendsCount.value === 0) {
      totalFriendsCount.value = response.totalElements;
    }
  } catch (error) {
    tabState.data = [];
    tabState.totalPages = 0;
    tabState.totalElements = 0;
  } finally {
    tabState.isLoading = false;
  }
}

// Função para carregar dados baseado na aba ativa
async function loadData() {
  const tabState = currentTabState.value;

  // Evita múltiplas chamadas simultâneas
  if (tabState.isLoading) {
    return;
  }

  try {
    if (activeTab.value === "my-friends") {
      await loadFriends();
    } else {
      await loadGeneralPeople();
    }
  } catch (error) {}
}

// Função para trocar de aba (sem limpar pesquisa - cada aba mantém sua pesquisa)
async function changeTab(newTab) {
  if (activeTab.value === newTab) return; // Evita reload desnecessário

  activeTab.value = newTab;

  // Sempre carrega dados ao trocar de aba para garantir dados atualizados
  await loadData();
}

// Função para verificar se precisa carregar dados ao trocar de aba
async function checkAndLoadTabData() {
  // Sempre carrega dados para garantir atualização
  await loadData();
}

onMounted(async () => {
  // Carrega dados da aba ativa
  await loadData();

  // Carregar contador total de amigos em paralelo se necessário
  if (activeTab.value === "all" && totalFriendsCount.value === 0) {
    try {
      const friendsResponse = await getFriends({ page: 0, size: 1 });
      totalFriendsCount.value = friendsResponse.totalElements;
    } catch (error) {}
  }
});

const currentDataList = computed(() => currentTabState.value.data);

const paginatedFriends = computed(() => {
  return currentDataList.value;
});

watch(searchQuery, async (newValue, oldValue) => {
  if (oldValue && oldValue.trim() && (!newValue || !newValue.trim())) {
    currentPagination.value = 0;
    currentTabState.value.data = [];
    await loadData();
  }
});

async function handleSearch(query) {
  const searchValue = query && typeof query === "string" ? query : searchQuery.value;

  // Limpa os resultados anteriores antes de nova busca
  currentTabState.value.data = [];
  searchQuery.value = searchValue;
  currentPagination.value = 0;

  await loadData();
}

// Função específica para o submit do form
async function handleFormSubmit(event) {
  event.preventDefault();
  await handleSearch(searchQuery.value);
}
</script>

<template>
  <main class="container mx-auto p-6 xl:max-w-7xl flex flex-col flex-1">
    <div class="container-search-friends">
      <h2 class="text-3xl font-bold border-b border-bp_neutral-800 pb-6 mb-6">
        Conecte-se com outros alunos
      </h2>

      <nav
        class="flex border-b-2 border-bp_grayscale-500 space-x-4 text-bp_grayscale-500 mb-6"
      >
        <button
          @click="changeTab('all')"
          :class="[
            'p-4',
            { 'border-b-2 border-bp_green-400 text-bp_green-400': activeTab === 'all' },
          ]"
        >
          Buscar Todos
        </button>
        <button
          @click="changeTab('my-friends')"
          :class="[
            'p-4',
            {
              'border-b-2 border-bp_green-400 text-bp_green-400':
                activeTab === 'my-friends',
            },
          ]"
        >
          Meus Amigos
          <span v-if="activeTab === 'my-friends'">({{ totalElements }})</span>
          <span v-else>({{ totalFriendsCount }})</span>
        </button>
      </nav>

      <div class="space-y-6">
        <div>
          <form class="w-full lg:w-3/4" @submit.prevent="handleFormSubmit">
            <InputSearch v-model="searchQuery" @search="handleSearch" />
          </form>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
        <div v-if="isLoading" class="col-span-full flex justify-center py-8">
          <div class="text-bp_green-400">Carregando...</div>
        </div>
        <div
          v-else-if="paginatedFriends.length === 0"
          class="col-span-full flex justify-center py-8"
        >
          <div class="text-bp_grayscale-500">Nenhum amigo encontrado</div>
        </div>
        <ListItemFriend
          v-else
          v-for="friend in paginatedFriends"
          :key="friend.id"
          :friend="friend"
        />
      </div>
    </div>
    <div class="flex justify-center mt-12 pb-7">
      <BpPagination
        v-if="totalPages > 1"
        :current="currentPagination"
        @changeCurrentValue="updateCurrentPagination"
        :count="totalPages"
      />
    </div>
  </main>
</template>
