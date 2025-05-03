<script setup>
const props = defineProps(['classSubject', 'interest'])
const { ano, 'id-turma': IdTurma, periodo, component, friends } = props.classSubject

const testFriends = friends?.[0]
  ? Array(10).fill(friends[0]) // Repete o primeiro amigo 10 vezes
  : [] //

const maxVisible = 4
const visibleUsers = testFriends?.slice(0, maxVisible) || []
const hiddenUsersCount = testFriends?.length - maxVisible || 0

const formatUserName = (name) => {
  const nameParts = name.split(' ')
  const firstName = name.split(' ')[0]
  const lastName = name.split(' ')[nameParts.length - 1]

  return `${firstName} ${lastName}`
}
</script>

<template>
  <div class="bg-[#020202] w-full rounded-md flex flex-col gap-6 p-4 text-vtd-secondary-100">
    <p>{{ component.nome }}</p>
    <div class="flex justify-between items-end">
      <div>
        <div v-if="visibleUsers.length > 0" class="flex gap-2 items-center">
          <div v-for="friend in visibleUsers" className="tooltip  rounded-full tooltip-bottom ">
            <div className="tooltip-content text-xs tooltip-info  tooltip-bottom">
              <div className="text-white">
                <span>{{ formatUserName(friend.name) }}</span>
              </div>
            </div>
            <div :key="friend.id">
              <img class="w-8 h-8 rounded-full" :src="friend.imageUrl" />
            </div>
          </div>
          <div class="w-8 h-8 rounded-full bg-[#fdfdfd] flex items-center justify-center text-black">
            +{{ hiddenUsersCount }}
          </div>
        </div>
        <div v-else class="border p-2 rounded-box text-xs border-dotted border-white">
          <span>SEM AMIGOS AQUI {{ ':(' }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 items-end font-medium">
        <span class="badge bg-transparent border text-vtd-secondary-100">{{
          component.codigo
        }}</span>
        <div class="flex gap-2">
          <span
            :class="[
              'badge border-none text-vtd-secondary-100',
              component.obrigatoria ? 'bg-bp_green-600' : 'bg-sky-600'
            ]"
            >{{ component.obrigatoria ? 'OBRIGATÓRIO' : 'OPTATIVO' }}</span
          >
          <span class="badge bg-transparent border text-vtd-secondary-100"
            >{{ component['carga-horaria-total'] }}h</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
