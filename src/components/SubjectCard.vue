<script setup>
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons-vue'

const props = defineProps(['classSubject', 'interest'])
const { code, type, name, teacher, time, friendsInClass } = props.classSubject

const maxVisible = 4
const visibleUsers = friendsInClass?.slice(0, maxVisible) || []
const hiddenUsersCount = friendsInClass?.length - maxVisible || 0
</script>

<template>
  <div
    :class="[
      'w-full rounded-md flex flex-col gap-2 p-4',
      interest ? 'bg-white/60 text-black' : 'bg-bp_neutral-700'
    ]"
  >
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold">{{ code }}</h1>
      <span
        v-if="!interest"
        class="justify-self-end text-sm px-3 py-1 rounded-2xl font-semibold"
        :class="[
          type === 'Obrigatória'
            ? 'bg-bp_yellow-200/20 text-bp_yellow-100'
            : 'bg-blue-200/50 text-blue-100'
        ]"
      >
        {{ type }}
      </span>
    </div>
    <div class="flex flex-col gap-2">
      <p>{{ name }}</p>
      <div v-if="!interest" class="flex gap-4 items-center">
        <UserOutlined />
        <p>{{ teacher }}</p>
      </div>
      <div v-if="!interest" class="flex gap-4 items-center">
        <ClockCircleOutlined />
        <p>{{ time }}</p>
      </div>
    </div>
    <div class="flex gap-4 items-center mt-2">
      <a-avatar-group>
        <a-tooltip
          v-for="user in visibleUsers"
          :key="user.id"
          :title="user.name"
          placement="top"
          class="mx-2"
        >
          <a-avatar v-if="user.avatar" :src="user.avatar" />
          <div
            v-if="!user.avatar"
            class="bg-bp_neutral-600 rounded-full flex items-center justify-center w-8 h-8"
          >
            <UserOutlined class="text-xl text-white" />
          </div>
        </a-tooltip>

        <a-avatar v-if="hiddenUsersCount > 0" style="background-color: #f56a00">
          +{{ hiddenUsersCount }}
        </a-avatar>
      </a-avatar-group>
    </div>
  </div>
</template>
