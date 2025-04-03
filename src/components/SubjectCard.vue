<script setup>
const props = defineProps(['subject'])
const { code, type, name, teacher, time } = props.subject
</script>

<script>
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons-vue';
import { Avatar, Tooltip } from 'ant-design-vue';

export default {
  components: {
    'a-avatar': Avatar,
    'a-avatar-group': Avatar.Group,
    'a-tooltip': Tooltip,
    UserOutlined: UserOutlined,
    ClockCircleOutlined: ClockCircleOutlined
  },
  data() {
    return {
      users: [
        { id: 1, name: 'Usuário 1', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1' },
        { id: 2, name: 'Usuário 2', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2' },
        { id: 3, name: 'Usuário 3', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3' },
        { id: 4, name: 'Usuário 4', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=4' },
        { id: 5, name: 'Usuário 5', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=5' },
        { id: 6, name: 'Usuário 6', avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=6' }
      ],
      maxVisible: 4
    }
  },
  computed: {
    visibleUsers() {
      return this.users.slice(0, this.maxVisible)
    },
    hiddenUsersCount() {
      return this.users.length - this.maxVisible
    },
    typeClass() {
      return this.subject.type === 'Obrigatória'
      ? 'bg-bp_yellow-200/20 text-bp_yellow-100'
      : 'bg-blue-500/20 text-blue-500'
    }
  },
}
</script>

<template>
  <div class="w-full bg-bp_neutral-700 rounded-md flex flex-col gap-2 p-4">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-bold">{{ code }}</h1>
      <span class="justify-self-end text-sm px-3 py-1 rounded-2xl font-semibold" :class="typeClass">
        {{ type }}
      </span>
    </div>
    <div class="flex flex-col gap-2">
      <p>{{ name }}</p>
      <div class="flex gap-4 items-center">
        <UserOutlined />
        <p>{{ teacher }}</p>
      </div>
      <div class="flex gap-4 items-center">
        <ClockCircleOutlined />
        <p>{{ time }}</p>
      </div>
    </div>
    <div>
      <a-avatar-group>
        <a-tooltip v-for="user in visibleUsers" :key="user.id" :title="user.name" placement="top">
          <a-avatar :src="user.avatar" />
        </a-tooltip>

        <a-avatar v-if="hiddenUsersCount > 0" style="background-color: #f56a00">
          +{{ hiddenUsersCount }}
        </a-avatar>
      </a-avatar-group>
    </div>
  </div>
</template>
