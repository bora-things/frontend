<script setup>
import { LinkedinFilled } from '@ant-design/icons-vue';
import { Avatar } from 'ant-design-vue';

const props = defineProps(['component']);
const { name, position, description } = props.component;

</script>
<template>
    <div class="w-64 bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-4">
        <div class="flex justify-between space-x-3 md:space-x-8 border-b border-b-bp_neutral-600 items-center pb-4 mb-4">
          <div class="flex place-items-center space-x-4">
            <div>
              <Avatar :size="64" src="/public/images/imgPerfil.png"/>
            </div>
            <div>
              <p class="font-semibold break-words whitespace-normal">{{ name }}</p>
              <p class="text-xs text-bp_neutral-400 break-words whitespace-normal">{{ position }}</p>
            </div>
          </div>
          <LinkedinFilled class="r-0"/>
        </div>
        <div>
          <p class="text-bp_neutral-400 break-words whitespace-normal">
            {{ description }}
          </p>
        </div>
      </div>      
 
</template>