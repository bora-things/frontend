<script setup>
import BpPagination from '@/components/BpPagination.vue'
import InputSearch from '@/components/InputSearch.vue'
import ListItemFriend from '@/components/ListItemFriend.vue'
import { computed, onMounted, ref } from 'vue'
import { getFriends } from './FriendsController'

const friends = ref([])
const currentPagination = ref(0)
const searchQuery = ref('')
const selectTypeFriends = ref('Todos')

function updateCurrentPagination(newValue) {
  currentPagination.value = newValue
}

onMounted(async () => {
  friends.value = await getFriends()
})

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const filteredFriends = computed(() => {
  return friends.value.filter((friend) => {
    const matchesTypeFriends =
      selectTypeFriends.value === 'Todos' ||
      (selectTypeFriends.value === 'same-course' && friend.of_my_course === 1) ||
      (selectTypeFriends.value === 'favorites' && friend.favorite === 1)

    const matchesSearchQuery =
      !searchQuery.value ||
      friend.name.toLowerCase().replace(' ', '').includes(searchQuery.value.toLowerCase()) ||
      friend.id.toString().replace(' ', '').includes(searchQuery.value)

    return matchesTypeFriends && matchesSearchQuery
  })
})

const paginatedFriends = computed(() => {
  const start = currentPagination.value * 14
  const end = start + 14
  return filteredFriends.value.slice(start, end)
})

const handleSearch = () => {
  updateSearchQuery(searchQuery.value);
};
</script>

<template>
  <div class="min-h-screen bg-bp_neutral-900 text-bp_neutral-50">
    <main class="px-4 md:px-16">
      <div class="container-search-friends">
        <h2 class="text-3xl font-bold border-b border-bp_neutral-800 pb-6 mb-6">amigos</h2>
        <div class="">
          <div class="flex flex-wrap gap-4 py-4 justify-end md:justify-between">
            <form @submit.prevent="handleSearch" class="w-full lg:w-1/2">
              <InputSearch
                @search="updateSearchQuery"
                v-model="searchQuery"
              />
            </form>

            <div class="">
              <select v-model="selectTypeFriends" name="filter" class="card-options text-lg">
                <option value="Todos">Todos</option>
                <option value="same-course">Do meu curso</option>
                <option value="favorites">Favoritos</option>
              </select>
            </div>
            <button class="btn btn-ghost py-2 bg-blue-500 w-full lg:w-1/4">
              <v-icon class="" name="md-personaddalt1-outlined" scale="1.5"></v-icon>
              Adicionar Amigo
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 mt-6 lg:grid-cols-2">
          <ListItemFriend v-for="friend in paginatedFriends" :key="friend.id" :friend="friend" />
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
