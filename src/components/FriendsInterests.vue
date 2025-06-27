<template>
  <button
    className="btn btn-sm bg-transparent text-white shadow-none w-fit self-end hover:bg-bp_grayscale-600 hover:shadow-lg
     hover:scale-105 transition-all duration-300"
    @click="openDialog"
  >
    <v-icon name="fa-users" class="text-white w-6 h-6 mr-2" />
    Interesses dos Amigos
  </button>
  <dialog ref="dialogRef" class="p-5 w-full modal">
    <div
      class="modal-box p-0 min-w-[95%] max-h-[95%] shadow-lg rounded-lg overflow-hidden flex flex-col gap-5"
    >
      <div
        class="overflow-x-auto bg-bp_grayscale-600 rounded-box flex flex-col relative group p-4 pl-0"
      >
        <div class="ml-6 mt-6">
          <h1 class="text-3xl">
            Interesses dos Colegas em
            <strong class="text-bp_green-400">{{ ano }}.{{ periodo }}</strong>
          </h1>
        </div>
        <form method="dialog" class="absolute top-2 right-2">
          <button className="btn btn-sm btn-circle btn-ghost text-lg ">✕</button>
        </form>

        <!-- Tabela só aparece quando há dados ou está carregando -->
        <table
          v-if="isLoading || hasData"
          class="min-w-full table table-zebra mt-4"
          style="min-width: 700px"
        >
          <thead class="">
            <tr class="border-b border-bp_grayscale-700">
              <th
                class="py-3 px-4 text-center text-xl bg-bp_grayscale-600 text-bp_grayscale-400 font-semibold text-white sticky left-0 z-30"
                style="width: 10%"
              >
                Disciplina
              </th>
              <th
                class="py-3 px-4 text-center text-lg bg-bp_grayscale-600 text-bp_grayscale-400 font-semibold text-white"
                style="width: 8%; min-width: 100px"
              >
                <div class="flex flex-col gap-1 items-center">
                  <span class="text-xl">Interessados</span>
                </div>
              </th>
              <template v-if="isLoading">
                <th
                  class="py-3 px-4 text-center text-sm font-semibold text-white"
                  style="min-width: 120px"
                >
                  <div class="flex flex-col gap-2 items-center">
                    <div
                      class="bg-bp_grayscale-500 rounded-full flex items-center justify-center w-12 h-12 animate-pulse"
                    >
                      <v-icon name="fa-user-alt" class="text-white w-6 h-6" />
                    </div>
                    <span class="text-md">Carregando...</span>
                  </div>
                </th>
              </template>
              <th
                v-else-if="hasData"
                v-for="friend in friends.sort((a, b) => a.name.localeCompare(b.name))"
                :key="friend.name"
                class="py-3 px-4 text-center text-sm font-semibold text-white"
                style="min-width: 120px"
              >
                <div class="flex flex-col gap-2 items-center">
                  <img
                    v-if="friend.imageUrl && !imageErrors[friend.name]"
                    :src="friend.imageUrl"
                    :alt="`Foto de ${friend.name}`"
                    class="h-12 w-12 rounded-full object-cover"
                    @error="handleImageError(friend.name)"
                  />
                  <div
                    v-else
                    class="bg-bp_grayscale-500 rounded-full flex items-center justify-center w-12 h-12"
                  >
                    <v-icon name="fa-user-alt" class="text-white w-6 h-6" />
                  </div>
                  <span class="text-md">{{ formatName(friend.name) }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="text-white">
            <!-- Loading state -->
            <tr v-if="isLoading" class="border-b-0">
              <td colspan="100%" class="py-8 px-4 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="loading loading-spinner loading-md text-white"></div>
                  <span class="text-lg text-gray-300"
                    >Carregando interesses dos amigos...</span
                  >
                </div>
              </td>
            </tr>
            <!-- Data rows -->
            <tr
              class="border-b-0 w-full"
              v-for="subject in subjectsStatus"
              :key="subject.nome"
              v-else-if="hasData"
            >
              <td
                class="py-2 px-4 font-medium sticky text-xl left-0 z-30 border-0"
                style="width: 10%"
              >
                <div
                  className="tooltip tooltip-right z-[1000] text-nowrap text-gray-200"
                  :data-tip="subject.codigo"
                >
                  <span>{{ capitalizeText(subject.nome) }}</span>
                </div>
              </td>
              <td
                class="py-2 px-4 text-center text-lg font-semibold"
                style="width: 8%; min-width: 100px"
              >
                <span
                  class="inline-flex items-center justify-center text-sm font-bold text-white"
                >
                  {{ getInterestedCount(subject) }}
                </span>
              </td>
              <td
                v-for="(status, idx) in subject.statuses"
                :key="idx"
                class="py-2 px-4 text-center text-lg"
                style="min-width: 120px"
              >
                <span
                  v-if="status != 'nao-pago'"
                  class="badge border-none text-white rounded-xl"
                  :class="statusClass(status)"
                  >{{ statusText(status) }}</span
                >
                <span v-else class="font-light text-base-100">-</span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vazio - aparece quando não há dados -->
        <div v-if="!isLoading && !hasData" class="py-12 px-4 text-center">
          <div class="flex flex-col items-center gap-4">
            <v-icon name="fa-user-friends" class="text-bp_grayscale-400 w-16 h-16" />
            <div class="flex flex-col gap-2">
              <span class="text-xl text-gray-300 font-semibold">
                Nenhum amigo com interesses encontrado
              </span>
              <span class="text-md text-gray-400">
                Não há amigos com interesses cadastrados para o semestre selecionado.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form method="dialog" className="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import api from "@/config/axios.config";
import { capitalizeText } from "@/utils/capitalizeText";
import { ref, watch } from "vue";

const props = defineProps({
  periodo: {
    type: String,
    required: true,
  },
  ano: {
    type: String,
    required: true,
  },
});

const dialogRef = ref(null);
const isLoading = ref(false);
const imageErrors = ref({});
const hasData = ref(false);

function handleImageError(friendName) {
  imageErrors.value[friendName] = true;
}

function formatName(name) {
  const words = name
    .trim()
    .split(" ")
    .filter((word) => word.length > 0);
  const lastName =
    words[words.length - 1].charAt(0).toUpperCase() +
    words[words.length - 1].slice(1).toLowerCase();

  const firstName = words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase();

  return `${firstName} ${lastName}`;
}

async function fetchInterests() {
  try {
    isLoading.value = true;
    hasData.value = false;
    const response = await api.get("/api/users/interests/friends", {
      params: {
        period: props.periodo,
        year: props.ano,
      },
    });

    const friendsData = response.data.friendsInterests || [];
    const componentsData = response.data.components || [];

    if (friendsData.length === 0 || componentsData.length === 0) {
      friends.value = [];
      components.value = [];
      hasData.value = false;
    } else {
      friends.value = friendsData;
      components.value = componentsData;
      hasData.value = true;
    }
  } catch (error) {
    console.error("Erro ao buscar interesses dos amigos:", error);
    friends.value = [];
    components.value = [];
    hasData.value = false;
  } finally {
    isLoading.value = false;
  }
}

function openDialog() {
  dialogRef.value?.showModal();
  if (!isLoading.value) {
    fetchInterests();
  }
}

// Only a few rows for brevity. Add more as needed.
const components = ref([]);
const friends = ref([]);

const subjectsStatus = ref([]);

watch(
  [components, friends],
  () => {
    if (
      components.value &&
      friends.value &&
      components.value.length > 0 &&
      friends.value.length > 0
    ) {
      subjectsStatus.value = components.value.map((subject) => {
        return {
          nome: subject.nome || "",
          codigo: subject.codigo || "",
          statuses: friends.value.map((friend) => {
            if (friend.subjectsFinished.includes(subject.codigo)) {
              return "pago";
            } else if (
              friend.interestsCodes &&
              friend.interestsCodes.includes(subject.codigo)
            ) {
              return "interesse";
            } else {
              return "nao-pago";
            }
          }),
        };
      });
      hasData.value = true;
    } else {
      subjectsStatus.value = [];
      hasData.value = false;
    }
  },
  { deep: true }
);

// Helper for status text
function statusText(status) {
  switch (status) {
    case "pago":
      return "TÁ PAGO";
    case "cursando":
      return "CURSANDO";
    case "interesse":
      return "PAGAREI";
    case "nao-pago":
      return "NÃO";
    default:
      return "";
  }
}

function statusClass(status) {
  switch (status) {
    case "pago":
      return "bg-green-500";
    case "cursando":
      return "bg-blue-500";
    case "interesse":
      return "bg-[#F59E0B]";
    case "nao-pago":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

// Função para contar quantos amigos têm interesse na matéria
function getInterestedCount(subject) {
  if (!subject.statuses) return 0;
  return subject.statuses.filter((status) => status === "interesse").length;
}
</script>
