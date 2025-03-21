<script setup>
import SubjectCard from '@/components/SubjectCard.vue';
import { CalendarOutlined, CustomerServiceOutlined, SolutionOutlined, TeamOutlined, IdcardOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { Button, Avatar } from 'ant-design-vue';
import { ref, onMounted } from 'vue';
import { getSubjects } from '../Dashboard/DashboardController';

const subjects = ref([]);

onMounted(async () => {
  subjects.value = await getSubjects();
});
</script>

<template>
    <div class="bg-bp_neutral-800 p-4 md:p-10 rounded-2xl m-6 md:m-10">
        <div class="flex items-center space-x-4 md:space-x-10">
            <Avatar :size="128" src="/public/images/imgPerfil.png" />
            <div class="font-bold space-y-2 md:space-y-4">
                <p class="text-xl md:text-3xl">Natálya Nunes</p>
                <div class="flex gap-6">
                    <div class="flex gap-2 items-center">
                        <CustomerServiceOutlined class="md:size-5"/>
                        <p>T.I</p>
                    </div>
                    <div class="flex gap-2 items-center">
                        <CalendarOutlined class="md:size-5"/>
                        <p>5° periodo</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex mt-6 mb-6">
                <div class="space-x-2 md:space-x-6 md:flex">
                  <a class="nav-item" href="#"> <div class="flex items-center gap-x-2">
                    <SolutionOutlined/> Historico
                  </div></a>
                  <a class="nav-item" href="#"> <div class="flex items-center gap-x-2">
                    <TeamOutlined/> Amigos
                  </div></a>
                  <a class="nav-item" href="#"> <div class="flex items-center gap-x-2">
                    <IdcardOutlined/> Informações Pessoais
                  </div></a>
                  <a class="nav-item" href="#"> <div class="flex items-center gap-x-2">
                    <SettingOutlined/> Configurações
                  </div></a>
                </div>           
        </div>
        <div class="space-y-0">
            <div class="flex gap-1 ml-6">
                <div
                v-for="period in [1, 2, 3, 4, 5]"
                :key="period"
                class="w-10 h-9 rounded-t-2xl bg-bp_neutral-600 text-white font-bold flex items-center justify-center 
                        hover:bg-bp_neutral-700 cursor-pointer"
                >
                {{ period }}
                </div>
            </div>
            <div class="bg-bp_neutral-100 rounded-md grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                <SubjectCard class=""
                v-for="subject in subjects"
                :key="subject.code"
                :subject="subject"/>
            </div>
        </div>
        
    </div>
</template>