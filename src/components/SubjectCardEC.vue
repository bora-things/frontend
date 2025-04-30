<script setup>
const props = defineProps(['classSubject', 'interest'])
const { code, type, name, teacher, time, workload, friendsInClass } = props.classSubject

const maxVisible = 4
const visibleUsers = friendsInClass?.slice(0, maxVisible) || []
const hiddenUsersCount = friendsInClass?.length - maxVisible || 0
</script>

<template>
  <div
    :class="[
      'w-full rounded-md flex flex-col gap-6 p-4',
      interest ? 'bg-white/60 text-black' : 'bg-bp_neutral-900'
    ]"
  >
    <div class="text-xl flex flex-col gap-2">
      <p>{{ name }}</p>
    </div>

    <div class="flex justify-between items-start gap-4">
        <div class="flex flex-col gap-1">

            <!-- Trocar isso para usar daisy -->
            <!-- <a-avatar-group>
            <a-tooltip
                v-for="user in visibleUsers"
                :key="user.id"
                :title="user.name"
                placement="top"
                class="mx-1"
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
            </a-avatar-group> -->
        </div>

        <div class="grid grid-cols-2 gap-1">
            <div class="border rounded-md text-center">
                <p class="text-xs px-3 font-semibold py-1">{{ code }}</p>
            </div>
            <div class="rounded-md text-center">
                <p
                    v-if="!interest"
                    class="justify-self-end text-xs px-3 py-1 rounded-md font-semibold"
                    :class="[
                    type === 'Obrigatória'
                        ? 'bg-bp_yellow-200/20 text-bp_yellow-100'
                        : 'bg-blue-200/50 text-blue-100'
                    ]"
                >
                    {{ type }}
                </p>
            </div>
            <div class="col-span-2 justify-self-end text-xs border px-3 font-semibold py-1 rounded-md text-center flex items-center gap-1">
                <p>{{ workload }}h</p>
            </div>
        </div>
    </div>    
</div>
</template>
