<script setup>
import BpButton from '@/components/BpButton.vue'
import BpPagination from '@/components/BpPagination.vue'
import ListItemFriend from '@/components/ListItemFriend.vue'
import InputSearch from '@/components/InputSearch.vue'
import { onMounted, ref, computed } from 'vue'
import { getFriends } from './FriendsController'

const friends = ref([]);
const currentPagination = ref(0);
const searchQuery = ref('');
const selectTypeFriends = ref('Todos');

function updateCurrentPagination(newValue) {
  currentPagination.value = newValue;
}

onMounted(async () => {
    friends.value = await getFriends(); 
});

const updateSearchQuery = (query) => {
  searchQuery.value = query;
};

const filteredFriends = computed(() => {
  return friends.value.filter(friend => {
    const matchesTypeFriends =
      selectTypeFriends.value === 'Todos'
      || (selectTypeFriends.value === 'same-course' && friend.of_my_course === 1)
      || (selectTypeFriends.value === 'favorites' && friend.favorite === 1);

    const matchesSearchQuery =
      !searchQuery.value 
      || friend.name.toLowerCase().includes(searchQuery.value.toLowerCase()) 
      || friend.id.toString().includes(searchQuery.value);

    return matchesTypeFriends && matchesSearchQuery;
  });
});

const paginatedFriends = computed(() => {
  const start = currentPagination.value * 14;
  const end = start + 14;
  return filteredFriends.value.slice(start, end);
});

</script>

<template>
  <div class="min-h-screen bg-bp_neutral-900 text-bp_neutral-50">
    <main class="px-4 md:px-16">
      <div class="container-search-friends">
        <h2 class="text-3xl font-bold border-b border-bp_neutral-800 pb-6 mb-6">amigos</h2>
        <div class="">
          <div class="flex flex-wrap md:justify-between">
            <InputSearch
            @search="updateSearchQuery"
            v-model="searchQuery" class="w-full md:w-2/3 mb-4 lg:mb-0" />

            <div class="">
              <select
                v-model="selectTypeFriends"
                name="filter"
                class="card-options text-lg"
                >
                <option value="Todos">Todos</option>
                <option value="same-course">Do meu curso</option>
                <option value="favorites">Favoritos</option>
              </select>
            </div>
          </div>
          <BpButton class="lg:mt-6">
            <v-icon class="" name="md-personaddalt1-outlined" scale="1.5"></v-icon>
            Adicionar Amigo
          </BpButton>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
          <ListItemFriend
            v-for="friend in paginatedFriends"
            :key="friend.id"
            :friend="friend"
          />
        </div>
      </div>
      <div class="flex justify-center mt-12 pb-7">
        <BpPagination
          :current="currentPagination"
          @changeCurrentValue="updateCurrentPagination"
          :count="totalPages"
        />
      </div>
    </main>
  </div>
</template>