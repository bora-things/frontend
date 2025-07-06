<script setup>
import api from "@/config/axios.config";
import { capitalizeText } from "@/utils/capitalizeText";
import { nextTick, ref } from "vue";

const props = defineProps({
  subjectCode: {
    type: String,
    required: true,
  },
  buttonText: {
    type: String,
    default: "Ver Ementa",
  },
});

const dialogRef = ref(null);
const isLoading = ref(false);
const subject = ref({});
const friends = ref([]);
const teachers = ref([]);

const isSyllabusShadowVisible = ref(false);
const isFriendsShadowVisible = ref(false);

function getCorAprovacao(review) {
  if (review <= 7) {
    return "text-bp_pink-100";
  } else if (review <= 8.5) {
    return "text-bp_yellow-300";
  } else {
    return "text-bp_green-600";
  }
}

function handleSyllabusScroll() {
  const container = document.querySelector(".syllabus-content");
  if (container) {
    isSyllabusShadowVisible.value =
      container.scrollHeight > container.clientHeight &&
      container.scrollTop + container.clientHeight < container.scrollHeight;
  }
}

function handleFriendsScroll() {
  const container = document.querySelector(".friends-container");
  if (container) {
    isFriendsShadowVisible.value =
      container.scrollHeight > container.clientHeight &&
      container.scrollTop + container.clientHeight < container.scrollHeight;
  }
}

async function fetchSubjectData() {
  try {
    isLoading.value = true;
    const response = await api.get("/api/components/details?code=" + props.subjectCode);

    subject.value = response.data;
    friends.value = response.data.friends || [];
    teachers.value = response.data.teachers || [];

    await nextTick(() => {
      const syllabusContainer = document.querySelector(".syllabus-content");
      if (syllabusContainer) {
        syllabusContainer.addEventListener("scroll", handleSyllabusScroll);
        handleSyllabusScroll();
      }

      const friendsContainer = document.querySelector(".friends-container");
      if (friendsContainer) {
        friendsContainer.addEventListener("scroll", handleFriendsScroll);
        handleFriendsScroll();
      }
    });
  } catch (error) {
    console.error("Erro ao buscar dados da disciplina:", error);
  } finally {
    isLoading.value = false;
  }
}

function openDialog() {
  dialogRef.value?.showModal();
  if (!isLoading.value) {
    fetchSubjectData();
  }
}

// Expor a função para componentes pais
defineExpose({
  openDialog,
});
</script>

<template>
  <dialog ref="dialogRef" class="p-5 w-full modal">
    <div
      class="modal-box p-0 min-w-[95%] max-h-[95%] shadow-lg rounded-lg overflow-hidden flex flex-col gap-5"
    >
      <div
        class="overflow-x-auto bg-bp_grayscale-600 rounded-box flex flex-col relative group p-6"
      >
        <!-- Header -->
        <div class="flex flex-col gap-5 mb-4">
          <form method="dialog" class="ml-4 self-end">
            <button class="btn btn-sm btn-circle btn-ghost text-lg text-white">✕</button>
          </form>
          <div class="flex-1 flex justify-between w-full">
            <div>
              <h1 class="text-3xl font-bold mb-2 text-white">
                {{
                  isLoading
                    ? "Carregando..."
                    : capitalizeText(subject.name) || "Nome não encontrado"
                }}
              </h1>
              <div v-if="!isLoading && subject.name" class="flex flex-wrap text-sm gap-2">
                <span
                  class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1 text-white"
                >
                  Código: {{ subject.code || subject.codigo }}
                </span>
                <span
                  class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1 text-white"
                >
                  Carga Horária: {{ subject.workload || subject["carga-horaria-total"] }}H
                </span>
                <span
                  class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1 text-white"
                >
                  Tipo:
                  {{
                    subject.mandatory !== undefined
                      ? subject.mandatory
                        ? "Obrigatória"
                        : "Optativa"
                      : subject.obrigatoria
                      ? "Obrigatória"
                      : "Optativa"
                  }}
                </span>
              </div>
            </div>
            <button
              class="btn bg-bp_green-500 hover:bg-bp_green-600 text-white border-none"
            >
              <v-icon name="fa-plus" class="w-4 h-4 mr-1" />
              Adicionar à Grade
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="py-12 px-4 text-center">
          <div class="flex flex-col items-center gap-3">
            <div class="loading loading-spinner loading-md text-white"></div>
            <span class="text-lg text-gray-300">Carregando dados da disciplina...</span>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="subject.name || subject.nome" class="space-y-6">
          <!-- Add to Schedule Button -->

          <!-- Syllabus Section -->
          <section
            class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md p-4 relative"
          >
            <h2 class="text-xl font-semibold mb-3 text-white">Ementa da Disciplina</h2>
            <div
              class="syllabus-content max-h-40 overflow-y-auto relative hide-scrollbar"
              @scroll="handleSyllabusScroll"
            >
              <p class="text-sm text-gray-300 pr-2">
                {{ subject.description || subject.ementa || "Ementa não disponível" }}
              </p>
            </div>
            <div
              v-if="isSyllabusShadowVisible"
              class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-bp_neutral-850 to-transparent pointer-events-none"
            ></div>
          </section>

          <!-- Teachers Section -->
          <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md p-4">
            <h2 class="text-xl font-semibold text-center mb-4 text-white">
              Professores Que Lecionam Esta Disciplina
            </h2>
            <div v-if="teachers.length === 0" class="text-center text-gray-400 py-4">
              Nenhum professor cadastrado
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="(teacher, index) in teachers"
                :key="index"
                class="bg-bp_neutral-825 border border-bp_neutral-600 p-3 rounded flex items-center space-x-3"
              >
                <img
                  v-if="teacher.imageUrl"
                  :src="teacher.imageUrl"
                  @error="teacher.imageUrl = null"
                  alt="Foto do professor"
                  class="rounded-full w-12 h-12 object-cover"
                />
                <div
                  v-else
                  class="bg-bp_grayscale-500 rounded-full flex items-center justify-center w-12 h-12"
                >
                  <v-icon name="fa-user-alt" class="text-white w-6 h-6" />
                </div>
                <div>
                  <p class="text-white font-medium">{{ capitalizeText(teacher.name) }}</p>
                  <p class="text-sm">
                    <span class="text-gray-300">Avaliação: </span>
                    <span :class="getCorAprovacao(teacher.review)">{{
                      teacher.review.toFixed(1)
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Friends Section -->
          <section
            class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md p-4 relative"
          >
            <h2 class="text-xl font-semibold text-center mb-4 text-white">
              Amigos Interessados
            </h2>
            <div v-if="friends.length === 0" class="text-center text-gray-400 py-4">
              Nenhum amigo interessado!
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 friends-container max-h-44 overflow-y-auto relative hide-scrollbar"
              @scroll="handleFriendsScroll"
            >
              <div
                v-for="(friend, index) in friends"
                :key="index"
                class="bg-bp_neutral-825 border border-bp_neutral-600 p-3 rounded flex items-center space-x-3"
              >
                <img
                  v-if="friend.imageUrl"
                  :src="friend.imageUrl"
                  @error="friend.imageUrl = null"
                  alt="Foto do amigo"
                  class="rounded-full w-12 h-12 object-cover"
                />
                <div
                  v-else
                  class="bg-bp_grayscale-500 rounded-full flex items-center justify-center w-12 h-12"
                >
                  <v-icon name="fa-user-alt" class="text-white w-6 h-6" />
                </div>
                <div>
                  <p class="text-white font-medium">
                    {{ capitalizeText(friend.personName) }}
                  </p>
                  <p class="text-sm text-gray-300">
                    {{ capitalizeText(friend.courseName) }}
                  </p>
                  <span class="text-bp_neutral-400">{{ friend.period }}° Período </span>
                </div>
              </div>
            </div>
            <div
              v-if="isFriendsShadowVisible"
              class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-bp_neutral-850 to-transparent pointer-events-none"
            ></div>
          </section>
        </div>
        <!-- Empty State -->
        <div v-else class="py-12 px-4 text-center">
          <div class="flex flex-col items-center gap-4">
            <v-icon
              name="fa-exclamation-circle"
              class="text-bp_grayscale-400 w-16 h-16"
            />
            <div class="flex flex-col gap-2">
              <span class="text-xl text-gray-300 font-semibold">
                Erro ao carregar dados
              </span>
              <span class="text-md text-gray-400">
                Não foi possível carregar as informações da disciplina.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  scrollbar-width: none;
}
</style>
