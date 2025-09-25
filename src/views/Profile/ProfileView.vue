<script setup>
import SubjectCard from "@/components/SubjectCard.vue";
import UserImage from "@/components/UserImage.vue";
import api from "@/config/axios.config";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  deleteFriendship,
  getClassrooms,
  getInterests,
  sendFriendRequest,
  updateFriendRequest,
} from "./ProfileController";

const route = useRoute();
const user = ref(null);

const classesCursados = ref([]);
const classesInteresse = ref([]);

const selectedSemesterCursado = ref({});
const selectedSemesterInteresse = ref({});

const failed = ref(false);

const requestId = ref(null);

const friends = ref([]);
const semesters = ref([]);
const isFriendsOpen = ref(false);

const friendStatus = ref(null);

const openFriends = () => {
  if (friendStatus.value == "FRIEND") isFriendsOpen.value = true;
};

const closeFriends = () => {
  isFriendsOpen.value = false;
};

const semestresCursados = computed(() => {
  return semesters.value.filter((s) => !s.interesse);
});

const semestresInteresse = ref([]);

const selectSemesterCursado = (semester) => {
  selectedSemesterCursado.value = semester;
};

const selectSemesterInteresse = (semester) => {
  selectedSemesterInteresse.value = semester;
};

watch(selectedSemesterCursado, (newValue) => {
  const selected = newValue;

  if (selected && selected.components) {
    classesCursados.value = selected.components.filter((item) => item != null);
  } else {
    classesCursados.value = [];
  }
});

watch(selectedSemesterInteresse, (newValue) => {
  const selected = newValue;
  if (selected && selected.components) {
    classesInteresse.value = selected.components;
  } else {
    classesInteresse.value = [];
  }
});

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      // Reset dos dados
      user.value = null;
      semesters.value = [];
      semestresInteresse.value = [];
      classesCursados.value = [];
      classesInteresse.value = [];
      selectedSemesterCursado.value = {};
      selectedSemesterInteresse.value = {};
      failed.value = false;
      requestId.value = null;
      friends.value = [];
      isFriendsOpen.value = false;
      friendStatus.value = null;

      // Recarrega os dados para o novo usuário
      const userId = parseInt(newId);
      await Promise.all([fetchUserData(userId), fetchInterests(userId)]);

      if (user.value.friendStatus == "SELF") {
        await fetchSemestres(userId);
      }
    }
  },
  { immediate: false }
);

const fetchSemestres = async (userId) => {
  try {
    const classrooms = await getClassrooms(userId);

    // Agrupa por semestre
    const semestersObj = classrooms.reduce((acc, classroom) => {
      const semesterKey = classroom.ano + "-" + classroom.periodo;
      if (!acc[semesterKey]) {
        acc[semesterKey] = {
          ano: classroom.ano,
          periodo: classroom.periodo,
          components: [],
          interesse: false,
        };
      }
      acc[semesterKey].components.push(classroom.component);
      return acc;
    }, {});

    const sortedKeys = Object.keys(semestersObj).sort((a, b) => {
      const [anoA, periodoA] = a.split("-").map(Number);
      const [anoB, periodoB] = b.split("-").map(Number);
      if (anoA !== anoB) return anoA - anoB;
      return periodoA - periodoB;
    });

    semesters.value = sortedKeys.map((key, idx) => ({
      ...semestersObj[key],
      semester: key,
      numero: idx + 1,
    }));
    selectSemesterCursado(semesters.value[0]);
  } catch (error) {
    console.error("Erro ao buscar semestres:", error);
  }
};

const fetchInterests = async (userId) => {
  const interestsRaw = await getInterests(userId);
  // Agrupa interesses por semestre
  const semestresMap = {};
  // Para cálculo do período
  const semestresCursadosArr = semestresCursados.value.map((s) => ({
    year: s.ano,
    period: s.periodo,
  }));
  const todosSemestres = [...semestresCursadosArr];
  interestsRaw.forEach((interest) => {
    const key = interest.year + "-" + interest.period;
    if (!semestresMap[key]) {
      semestresMap[key] = {
        ano: interest.year,
        periodo: interest.period,
        components: [],
        semester: key,
      };
      todosSemestres.push({ year: interest.year, period: interest.period });
    }
    semestresMap[key].components.push(interest.component);
  });
  // Ordena todos os semestres
  todosSemestres.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.period - b.period;
  });
  semestresInteresse.value = Object.values(semestresMap).map((semestre) => {
    const idx = todosSemestres.findIndex(
      (s) => s.year === semestre.ano && s.period === semestre.periodo
    );
    return {
      ...semestre,
      periodoNumero: idx + 1, // começa em 1
    };
  });
  semestresInteresse.value.sort((a, b) => {
    if (a.ano !== b.ano) return a.ano - b.ano;
    return a.periodo - b.periodo;
  });
  selectSemesterInteresse(semestresInteresse.value[0]);
};

const fetchUserData = async (userId) => {
  try {
    const response = await api.get("/api/students/" + userId);
    user.value = response.data;
    friendStatus.value = user.value.friendStatus;
    requestId.value = user.value.requestId;
  } catch (error) {
    failed.value = true;
    console.error("Erro ao buscar dados do usuário:", error);
  }
};

onMounted(async () => {
  const userId = parseInt(route.params.id);

  if (user.value) {
    friends.value = user.value.friends; //Fetch
    semesters.value = user.value.semesters;
    if (semestresInteresse.value.length > 0) {
      selectSemesterInteresse(semestresInteresse.value[0]);
    }
  }
  Promise.all([await fetchInterests(userId), await fetchUserData(userId)]);
  if (user.value && user.value.friendStatus == "SELF") {
    await fetchSemestres(userId);
  }
});
</script>

<template>
  <div
    class="container flex-1 flex flex-col mx-auto p-6 xl:max-w-7xl bg-bp_neutral-800 p-4 md:p-10 space-y-6 md:space-y-10"
  >
    <div v-if="user" class="flex flex-col flex-1 gap-6">
      <div class="md:flex space-y-3 items-center md:justify-between">
        <div class="flex items-center space-x-4 md:space-x-10">
          <UserImage
            :image-url="user ? user.imageUrl : ''"
            :full-name="user ? user.studentName : ''"
            :alt-text="user ? user.studentName : ''"
            size="large"
          />
          <div class="font-bold space-y-2 md:space-y-4">
            <p class="text-xl md:text-3xl">{{ user ? user.studentName : "..." }}</p>
            <div class="flex flex-wrap md:flex-row gap-4">
              <div class="flex gap-2 items-center">
                <v-icon name="io-school-sharp" scale="1.2" />
                <p>{{ user ? user.courseName : "..." }}</p>
              </div>
              <div class="flex gap-2 items-center">
                <v-icon name="bi-calendar-event" scale="1.2" />
                <p>{{ user ? user.period : "..." }}° Periodo</p>
              </div>
              <div
                @click="openFriends"
                class="flex gap-2 items-center cursor-pointer hover:opacity-75 hover:text-bp_green-500 transition-opacity"
              >
                <v-icon name="fa-user-friends" scale="1.4" />
                <p>{{ user.friends }} Amigos</p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isFriendsOpen"
          class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <div
            class="bg-bp_neutral-800 p-6 rounded-2xl w-full max-w-4xl relative z-10 space-y-4"
          >
            <button
              @click="closeFriends"
              class="absolute top-3 right-3 text-white hover:opacity-70"
            >
              <v-icon name="fa-times" scale="1.5" />
            </button>

            <h2 class="text-xl font-bold text-white mb-2">
              <v-icon name="fa-user-friends" scale="1.4" /> Amigos de {{ user?.name }}
            </h2>

            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-4 friends-container max-h-72 overflow-y-auto relative hide-scrollbar"
            >
              <div
                v-if="friends.length === 0"
                class="text-bp_grayscale-400 text-sm md:text-base col-span-full text-center"
              >
                Nenhum amigo encontrado!
              </div>

              <div
                v-for="(friend, index) in friends"
                :key="index"
                class="bg-bp_neutral-825 border border-bp_neutral-600 p-2 rounded flex items-center space-x-3"
              >
                <img
                  :src="friend.urlImgPerfil"
                  alt="foto do amigo"
                  class="rounded-full w-12 h-12 object-cover"
                />
                <div>
                  <p class="font-bold text-white">{{ friend.name }}</p>
                  <p class="text-sm text-gray-300">
                    {{ friend.course_name }}
                    <span class="text-bp_neutral-400">{{ friend.period }}° período</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div @click="closeFriends" class="absolute inset-0"></div>
        </div>
        <div v-if="friendStatus !== 'SELF'">
          <div v-if="friendStatus == 'NOT_FRIENDS'">
            <button
              @click="
                async () => {
                  if (await sendFriendRequest(user.id)) {
                    friendStatus = 'REQUEST_SENT';
                  }
                }
              "
              class="bg-bp_green-500 hover:opacity-75 font-bold p-2 rounded-xl gap-x-2 flex items-center"
            >
              <v-icon name="md-personadd" scale="1.5" />
              Adicionar Amigo
            </button>
          </div>

          <div v-else-if="friendStatus === 'FRIENDS'">
            <button
              @click="
                deleteFriendship(user.id);
                friendStatus = 'NOT_FRIENDS';
              "
              class="bg-bp_neutral-900 font-bold p-2 rounded-xl gap-x-2 flex items-center"
            >
              <v-icon name="md-personremove" scale="1.5" />
              Remover Amigo
            </button>
          </div>
          <div v-else-if="friendStatus === 'REQUEST_SENT'" class="flex items-center">
            <button
              @click="
                updateFriendRequest(requestId, 'CANCELLED');
                friendStatus = 'NOT_FRIENDS';
              "
              class="bg-bp_neutral-700 group font-bold p-2 rounded-xl gap-x-2 border-bp_neutral-600 border hover:bg-red-600 hover:border-red-600 hover:text-white"
            >
              <span class="group-hover:hidden flex items-center gap-x-2">
                <v-icon name="md-personadd" scale="1.5" />
                Pedido Enviado</span
              >
              <span class="group-hover:flex hidden items-center gap-x-2">
                <v-icon name="md-personremove" scale="1.5" />
                Cancelar Pedido
              </span>
            </button>
          </div>
          <div v-else-if="friendStatus === 'REQUEST_RECEIVED'" class="flex items-center">
            <button
              @click="
                updateFriendRequest(requestId, 'ACCEPTED');
                friendStatus = 'FRIENDS';
              "
              class="bg-bp_neutral-700 hover:bg-bp_green-500 transition-all duration-200 font-bold p-2 rounded-xl gap-x-2 flex items-center border-bp_neutral-600 border"
            >
              <v-icon name="md-personadd" scale="1.5" />
              Aceitar Pedido de Amizade
            </button>
            <button
              @click="
                updateFriendRequest(requestId, 'REJECTED');
                friendStatus = 'NOT_FRIENDS';
              "
            >
              <v-icon
                name="io-close-circle-sharp"
                scale="1.5"
                class="ml-2 text-red-500 hover:scale-110 transition-transform cursor-pointer"
                title="Recusar Pedido de Amizade"
              />
            </button>
          </div>
        </div>
      </div>

      <div v-if="friendStatus === 'FRIENDS' || friendStatus === 'SELF'" class="space-y-6">
        <div v-if="friendStatus === 'SELF'" class="space-y-4">
          <p class="text-xl md:text-2xl mb-2">Semestres Cursados</p>
          <div v-if="semestresCursados.length > 0" class="flex flex-wrap gap-3">
            <button
              v-for="semester in semestresCursados"
              :key="semester.numero"
              @click="selectSemesterCursado(semester)"
              class="font-bold p-2 rounded-xl w-20 text-center transition-colors duration-200"
              :class="
                selectedSemesterCursado.numero === semester.numero
                  ? 'bg-bp_green-500 text-bp_neutral-900'
                  : 'bg-bp_neutral-700 hover:bg-bp_neutral-600'
              "
            >
              {{ semester.numero }}°
            </button>
          </div>
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-bp_neutral-700 rounded-lg"
          >
            <SubjectCard
              v-for="classItem in classesCursados"
              :key="classItem.codigo || classItem.code"
              :classSubject="{ component: classItem, friends: [] }"
            />
          </div>
        </div>
        <div class="space-y-4">
          <p class="text-xl md:text-2xl mb-2">Interesses para Próximos Semestres</p>
          <div v-if="semestresInteresse.length > 0" class="flex flex-wrap gap-3">
            <button
              v-for="semester in semestresInteresse"
              :key="semester.semester"
              @click="selectSemesterInteresse(semester)"
              class="font-bold p-2 rounded-xl w-20 text-center transition-colors duration-200"
              :class="
                selectedSemesterInteresse?.semester === semester.semester
                  ? 'bg-bp_green-100 text-black'
                  : 'bg-bp_neutral-700 hover:bg-bp_neutral-600'
              "
            >
              {{ semester.semester.replace("-", ".") }}
            </button>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-bp_neutral-700 rounded-lg"
          >
            <SubjectCard
              v-for="classItem in classesInteresse"
              :key="classItem.codigo || classItem.code"
              :classSubject="{ component: classItem, friends: [] }"
              interest
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-bp_grayscale-400 flex-1 text-center h flex flex-col justify-center items-center"
      >
        <img
          src="/images/bora_pagar_sad.png"
          alt="Perfil Privado"
          class="w-16 h-16 mb-4 object-cover rounded-lg"
        />
        <p class="font-semibold text-white">Este perfil está privado.</p>
        <p class="text-gray-400">Adicione como amigo para ver mais informações.</p>
      </div>
    </div>
    <div
      v-else-if="!failed"
      class="text-bp_grayscale-400 flex-1 text-center h flex flex-col justify-center items-center"
    >
      <span class="loading loading-spinner text-bp_green-500 h-16 w-16 mb-4"></span>
      <p>Carregando perfil...</p>
    </div>
    <div
      v-else
      class="text-bp_grayscale-400 flex-1 text-center h flex flex-col justify-center items-center"
    >
      <img
        src="/images/bora_pagar_sad.png"
        alt="Erro ao carregar perfil"
        class="w-16 h-16 mb-4 object-cover rounded-lg"
      />
      <p class="font-semibold text-white">Erro ao carregar perfil.</p>
      <p class="text-gray-400">Tente novamente mais tarde.</p>
      <a
        href="/dashboard"
        class="mt-4 bg-bp_green-500 text-white hover:opacity-75 font-bold p-2 rounded-xl gap-x-2 flex items-center"
      >
        <v-icon name="fa-home" scale="1.2" />
        Voltar para a página inicial
      </a>
    </div>
  </div>
</template>
