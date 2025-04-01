<script setup>
import { CalendarOutlined, CustomerServiceOutlined, IdcardOutlined, SettingOutlined, SolutionOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Avatar } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getSubjects } from '../Dashboard/DashboardController';
import { getProfiles } from './ProfileController';

import InputBase from '@/components/InputBase.vue';
import ListItemFriend from '@/components/ListItemFriend.vue';
import SubjectCard from '@/components/SubjectCard.vue';

const route = useRoute();
const user = ref(null);

const subjects = ref([]);
const activeSection = ref('historico');
const selectedPeriod = ref(1);
const privacidade = ref(1);
const friends= ref([]);

const isOwner = ref(false);

const setSection = (section) => {
  activeSection.value = section;
};

const selectPeriod = (period) => {
  selectedPeriod.value = period;
};

onMounted(async () => {
  const profiles = await getProfiles();
  const userId = parseInt(route.params.id);
  user.value = profiles.find((profile) => profile.id === userId);
  friends.value=user.value.friends;
  const loggedInUserId = 1;
  isOwner.value = user.value && user.value && user.value.id === loggedInUserId;

 privacidade.value = parseInt(user.value.privacidade);

  subjects.value = await getSubjects();
});

</script>

<template>
  <div class="bg-bp_neutral-800 p-4 md:p-10 rounded-2xl m-6 md:m-10">
    <div class="flex items-center space-x-4 md:space-x-10">
      <Avatar :size="128" src="">
        <UserOutlined class="text-6xl" />
      </Avatar>
      <div class="font-bold space-y-2 md:space-y-4">
        <p class="text-xl md:text-3xl">{{ user?user.name:"..." }}</p>
        <div class="flex gap-6">
          <div class="flex gap-2 items-center">
            <CustomerServiceOutlined class="md:size-5" />
            <p>{{ user?user.course:"..." }}</p>
          </div>
          <div class="flex gap-2 items-center">
            <CalendarOutlined class="md:size-5" />
            <p>{{ user?user.period:"..." }}° periodo</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex mt-6 mb-6">
      <div class="space-x-2 md:space-x-6 md:flex">
        <button @click="setSection('historico')" :class="['nav-item', activeSection === 'historico' ? 'active-nav' : '']">
          <div class="flex items-center gap-x-2">
            <SolutionOutlined /> Histórico
          </div>
        </button>
        <button @click="setSection('amigos')" :class="['nav-item', activeSection === 'amigos' ? 'active-nav' : '']">
          <div class="flex items-center gap-x-2">
            <TeamOutlined /> Amigos
          </div>
        </button>
        <button v-if="isOwner" @click="setSection('informacoes')" :class="['nav-item', activeSection === 'informacoes' ? 'active-nav' : '']">
          <div class="flex items-center gap-x-2">
            <IdcardOutlined /> Informações Pessoais
          </div>
        </button>
        <button v-if="isOwner" @click="setSection('configuracoes')" :class="['nav-item', activeSection === 'configuracoes' ? 'active-nav' : '']">
          <div class="flex items-center gap-x-2">
            <SettingOutlined /> Configurações
          </div>
        </button>
      </div>
    </div>

    <!-- Histórico -->
    <div v-if="activeSection === 'historico'" class="space-y-0">
      <div class="flex gap-1 ml-6">
        <div
          v-for="period in [1, 2, 3, 4, 5]"
          :key="period"
          @click="selectPeriod(period)"
          :class="[
            'w-10 h-9 rounded-t-2xl font-bold flex items-center justify-center hover:bg-bp_neutral-700 cursor-pointer',
            selectedPeriod === period ? 'bg-white text-black hover:bg-bp_neutral-300' : 'bg-bp_neutral-600 text-white'
          ]">
          {{ period }}
        </div>
      </div>
      <div class="bg-bp_neutral-100 rounded-md grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <SubjectCard 
        v-for="subject in subjects" 
        :key="subject.code" 
        :subject="subject" />
      </div>
    </div>

    <!-- Amigos -->
    <div v-if="activeSection === 'amigos'" class="text-white p-4">
      <p class="text-2xl font-bold mb-4">Amigos</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <ListItemFriend
        v-for="(friend, index) in friends"
        v-bind:key="index"
        :friend="friend"
        />
      </div>
      
    </div>

    <!-- Informações Pessoais -->
    <div v-if="activeSection === 'informacoes'" class="text-white p-4 space-y-4">
    <p class="text-2xl font-bold mb-4">Informações Pessoais</p>

    <div>
      <label for="nome" class="text-sm font-medium text-gray-300">Nome</label>
      <InputBase
        id="nome"
        placeholder="Digite seu nome"
      />
    </div>

    <div>
      <label for="curso" class="text-sm font-medium text-gray-300">Curso</label>
      <InputBase
        id="curso"
        placeholder="Digite o curso"
      />
    </div>

    <div>
      <label for="enfase" class="text-sm font-medium text-gray-300">Ênfase</label>
      <InputBase
        id="enfase"
        placeholder="Digite a ênfase"
      />
    </div>
  </div>

    <!-- Configurações -->
    <div v-if="activeSection === 'configuracoes'" class="text-white p-4 space-y-4">
    <p class="text-lg font-bold">Configurações</p>

    <div>
      <label for="privacidade" class="block text-sm font-medium text-gray-300">Privacidade da Conta</label>
      <select
        id="privacidade"
        v-model="privacidade"
        class="w-full py-4 bg-bp_neutral-800 border border-bp_neutral-700 rounded py-2 px-4 text-bp_neutral-50  placeholder:text-bp_neutral-700"
      >
        <option value="1">Pública</option>
        <option value="0">Privada</option>
        <option value="2">Somente Amigos</option>
      </select>
    </div>
  </div>

  </div>
</template>