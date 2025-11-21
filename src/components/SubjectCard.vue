<script setup>
import { capitalizeText } from "@/utils/capitalizeText";
import { computed, ref } from "vue";
import SubjectDetailsModal from "./SubjectDetailsModal.vue";
import UserImage from "./UserImage.vue";

const props = defineProps(["classSubject", "interest", "disabled", "blinking"]);
const modalRef = ref(null);
const component = computed(() => props.classSubject.component || {});
const friends = computed(() => props.classSubject.friends || []);

const maxVisible = 4;
const visibleUsers = computed(() => {
  // Use 'friends.value' para acessar o array
  return friends.value.slice(0, maxVisible);
});
const hiddenUsersCount = computed(() => {
  // Use 'friends.value' para acessar o array
  const length = friends.value.length;
  return length > 4 ? length - maxVisible : 0;
});

const formatUserName = (name) => {
  const nameParts = name.split(" ");
  const firstName = name.split(" ")[0];
  const lastName = name.split(" ")[nameParts.length - 1];

  return `${firstName} ${lastName}`;
};

function openModal() {
  console.log("Clique detectado no card:", component.codigo);
  console.log("Modal ref:", modalRef.value);
  modalRef.value?.openDialog();
}
</script>

<template>
  <div
    :id="component.codigo"
    class="bg-bp_grayscale-800 border-bp_grayscale-500 border w-full h-[150px] rounded-md flex flex-col justify-between p-4 text-vtd-secondary-100 cursor-pointer hover:bg-bp_grayscale-700 transition-colors duration-200"
    :class="{
      'border-bp_green-600': component['disciplina-obrigatoria'],
      'bg-bp_grayscale-800 border-bp_grayscale-500': !disabled && !blinking,
      'bg-bp_grayscale-700 border-bp_grayscale-500 animate-blinkOpacity': disabled,
      'animate-blinkOpacity': blinking && !disabled,
    }"
    @click="openModal"
  >
    <p class="font-sans font-medium text-sm">{{ capitalizeText(component.nome) }}</p>
    <div class="flex justify-between items-end">
      <div>
        <div v-if="visibleUsers.length > 0" class="flex gap-2 items-center">
          <div
            v-for="friend in visibleUsers"
            :key="friend.id"
            class="tooltip tooltip-info rounded-full tooltip-bottom"
          >
            <UserImage
              :show-tooltip="true"
              :image-url="friend.imageUrl"
              :full-name="formatUserName(friend.name)"
              :alt-text="formatUserName(friend.name)"
            />
          </div>

          <div
            v-if="hiddenUsersCount > 0"
            class="w-10 h-10 rounded-full bg-[#fdfdfd] flex items-center justify-center text-black"
          >
            +{{ hiddenUsersCount }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 items-end">
        <span
          class="font-sans badge border-bp_grayscale-500 flex items-center justify-center bg-transparent border text-vtd-secondary-100"
        >
          {{ component.codigo }}
        </span>
        <div class="flex gap-2">
          <span
            :class="[
              'font-sans badge text-vtd-secondary-100 bg-transparent border',
              component['disciplina-obrigatoria']
                ? 'border-bp_green-600'
                : 'border-sky-600',
            ]"
            >{{ component["disciplina-obrigatoria"] ? "OBRIGATÓRIO" : "OPTATIVO" }}</span
          >
          <span
            class="font-sans badge border-bp_grayscale-500 flex items-center justify-center bg-transparent border text-vtd-secondary-100"
          >
            {{ component["carga-horaria-total"] }}H</span
          >
        </div>
      </div>
    </div>
  </div>

  <!-- Modal do Subject Syllabus -->
  <SubjectDetailsModal ref="modalRef" :subject-code="component.codigo" />
</template>

<style scoped>
@keyframes blinkOpacity {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
.animate-blinkOpacity {
  animation: blinkOpacity 1s linear infinite;
}
</style>
