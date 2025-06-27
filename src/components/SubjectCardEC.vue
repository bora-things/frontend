<script setup>
import { capitalizeText } from "@/utils/capitalizeText";
import { computed, ref, watch } from "vue";

const props = defineProps(["component", "period"]);

const period = ref(props.period);
const component = props.component;

const friends = {
  "2025-2": [
    {
      id: 1,
      name: "Lucas",
      imageUrl: "https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_1280.png",
    },
    {
      id: 2,
      name: "Ana",
      imageUrl:
        "https://cdn.pixabay.com/photo/2014/04/03/10/44/avatar-311292_960_720.png",
    },
  ],
  "2026-1": [
    {
      id: 3,
      name: "Pedro",
      imageUrl: "https://cdn.pixabay.com/photo/2014/04/03/11/47/avatar-312160_1280.png",
    },
    {
      id: 4,
      name: "Maria",
      imageUrl: "https://cdn.pixabay.com/photo/2014/04/03/11/56/avatar-312603_1280.png",
    },
  ],
};

// Atualizar period quando a prop mudar
watch(
  () => props.period,
  (newValue) => {
    period.value = newValue;
  }
);

const maxVisible = 4;

const visibleUsers = computed(() => friends[period.value]?.slice(0, maxVisible) || []);

const hiddenUsersCount = computed(() =>
  friends[period.value]?.length > maxVisible
    ? friends[period.value].length - maxVisible
    : 0
);

const formatUserName = (name) => {
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  return `${firstName} ${lastName}`;
};
</script>

<template>
  <div
    :id="component.codigo"
    class="bg-bp_grayscale-800 border-bp_grayscale-500 border w-full h-[160px] rounded-md flex flex-col justify-between gap-6 p-4 text-vtd-secondary-100"
  >
    <p class="font-sans font-medium">{{ capitalizeText(component.nome) }}</p>
    <div class="flex justify-between flex-row-reverse">
      <div class="flex flex-col gap-2 items-end">
        <span
          class="font-sans badge border-bp_grayscale-500 flex items-center justify-center bg-transparent border text-vtd-secondary-100"
          >{{ component.codigo }}</span
        >
        <div class="flex gap-2">
          <span
            :class="[
              'font-sans badge text-vtd-secondary-100 bg-transparent border',
              component.obrigatoria ? 'border-bp_green-600' : 'border-sky-600',
            ]"
            >{{ component.obrigatoria ? "OBRIGATÓRIO" : "OPTATIVO" }}</span
          >
          <span
            class="font-sans badge border-bp_grayscale-500 flex items-center justify-center bg-transparent border text-vtd-secondary-100"
          >
            {{ component["carga-horaria-total"] }}H</span
          >
        </div>
      </div>
      <div v-if="visibleUsers.length > 0" class="flex gap-2 items-center">
        <div
          v-for="friend in visibleUsers"
          className="tooltip tooltip-info rounded-full tooltip-bottom "
        >
          <div className="tooltip-content text-xs ">
            <div className="text-white">
              <span>{{ formatUserName(friend.name) }}</span>
            </div>
          </div>
          <div :key="friend.id">
            <img class="w-10 h-10 rounded-full" :src="friend.imageUrl" />
          </div>
        </div>
        <div
          v-if="hiddenUsersCount > 0"
          class="w-10 h-10 rounded-full bg-[#fdfdfd] flex items-center justify-center text-black"
        >
          +{{ hiddenUsersCount }}
        </div>
      </div>
    </div>
  </div>
</template>
