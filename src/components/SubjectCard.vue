<script setup>
const props = defineProps(['classSubject', 'interest'])
const { ano, 'id-turma': IdTurma, periodo, component, friends } = props.classSubject

const maxVisible = 4
const visibleUsers = friends?.slice(0, maxVisible) || []
const hiddenUsersCount = friends?.length > 4 ? friends.length - maxVisible : 0

const formatUserName = (name) => {
  const nameParts = name.split(' ')
  const firstName = name.split(' ')[0]
  const lastName = name.split(' ')[nameParts.length - 1]

  return `${firstName} ${lastName}`
}
</script>

<template>
  <div class="bg-[#020202] w-full h-[160px] rounded-md flex flex-col justify-between gap-6 p-4 text-vtd-secondary-100">
    <p>{{ component.nome }}</p>
    <div class="flex justify-between items-end">
      <div>
        <div v-if="visibleUsers.length > 0" class="flex gap-2 items-center">
          <div v-for="friend in visibleUsers" className="tooltip tooltip-info rounded-full tooltip-bottom ">
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
        <div v-else class="border p-2 rounded-box text-xs border-dotted border-white">
          <span>SEM AMIGOS AQUI {{ ':(' }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 items-end ">
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
