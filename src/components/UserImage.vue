<template>
  <div
    class="rounded-full tooltip-bottom flex items-center justify-center text-xl font-bold text-gray-700 select-none"
    :style="avatarStyle"
    :class="{
      tooltip: showTooltip,
      'w-12 h-12': size === 'small',
      'w-16 h-16': size === 'medium',
      'w-24 h-24': size === 'large',
    }"
  >
    <div v-if="showTooltip" className="tooltip-content text-sm ">
      <div className="text-white">
        <span>{{ capitalizeText(fullName) }}</span>
      </div>
    </div>
    <img
      v-if="!imageError && imageUrl"
      :src="imageUrl"
      @error="onImageError"
      class="w-full h-full object-cover rounded-full"
      :alt="altText"
    />
    <span
      v-else
      class="w-full h-fit leading-[1rem] flex items-center justify-center"
      :class="{
        'text-sm': size === 'small',
        'text-xl': size === 'medium',
        'text-3xl': size === 'large',
      }"
    >
      {{ initials }}
    </span>
  </div>
</template>

<script setup>
import { capitalizeText } from "@/utils/capitalizeText";
import { computed, ref } from "vue";

const props = defineProps({
  imageUrl: { type: String, required: false },
  fullName: { type: String, required: true },
  size: { type: String, required: false, default: "small" },
  altText: { type: String, required: false, default: "Imagem do Usuário" },
  showTooltip: { type: Boolean, required: false, default: false },
});

const imageError = ref(false);

function onImageError() {
  imageError.value = true;
}

const initials = computed(() => {
  if (!props.fullName) return "";
  const names = props.fullName.trim().split(" ");
  const first = names[0]?.[0] || "";
  const second = names[1]?.[0] || "";
  return (first + second).toUpperCase();
});

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = hash % 360;
  return `hsl(${h}, 70%, 80%)`;
}

const avatarStyle = computed(() => ({
  background:
    imageError.value || !props.imageUrl ? stringToColor(props.fullName) : "transparent",
}));
</script>
