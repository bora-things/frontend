<script setup>
import { ref } from 'vue';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons-vue';

const props = defineProps(['doubt']);
const { doubts, descriptionDoubts } = props.doubt;

const isOpen = ref(false);

const toggleQuestion = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <!-- Card fechado -->
  <div 
    v-if="!isOpen" 
    class="w-full bg-bp_neutral-700 border border-bp_neutral-600 text-bp_neutral-200 rounded-[2.5rem] py-8 px-14"
  >
    <div class="flex justify-between space-x-3 md:space-x-8 items-center">
      <div class="flex font-bold gap-2 items-center">
        <h1 class="text-4xl">01</h1>
        <p class="text-lg">{{ doubts }}</p>
      </div>
      <div>
        <PlusCircleOutlined class="text-4xl cursor-pointer" @click="toggleQuestion" />
      </div>
    </div>
  </div>

  <!-- Card aberto -->
  <div 
    v-else 
    class="w-full bg-bp_green-400 border border-bp_green-500 text-bp_neutral-900 rounded-[2.5rem] py-8 px-14"
  >
    <div class="flex justify-between space-x-3 md:space-x-8 items-center border-b border-b-bp_neutral-600 pb-4 mb-4">
      <div class="flex font-bold gap-6 items-center">
        <h1 class="text-4xl">01</h1>
        <p class="text-lg">{{ doubts }}</p>
      </div>
      <div>
        <MinusCircleOutlined class="text-4xl cursor-pointer" @click="toggleQuestion" />
      </div>
    </div>
    <div>
      <p>
        {{ descriptionDoubts }}
      </p>
    </div>
  </div>
</template>
