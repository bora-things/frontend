<template>
  <main class="p-5 w-full">
    <div class="container mx-auto shadow-lg rounded-lg overflow-hidden flex flex-col gap-5">
      <div class="space-y-2">
        <h1 class="text-5xl font-semibold">Interesses</h1>
        <dialog className="dropdown dropdown-hover bg-bp_grayscale-600 p-2 rounded-box text-white">
          <div tabIndex="{0}" role="button" className=" m-1 p-0 flex items-center gap-2 ">
            {{ period ? period : 'Selecione um Período' }}
            <v-icon name="bi-chevron-down" scale="1.2"></v-icon>
          </div>
          <ul
            tabIndex="{0}"
            className="text-lg dropdown-content menu bg-bp_grayscale-700 rounded-box z-1 w-52 p-2 shadow-sm gap-1"
          >
            <li class="opacity-50">Selecione um periodo</li>
            <li
              v-for="p in ['2025.2', '2026.1', '2026.2']"
              :key="p"
              class="hover:bg-bp_grayscale-600 p-1 rounded-lg cursor-pointer"
              :class="{ 'bg-bp_grayscale-600': period === p }"
              @click="period = p"
            >
              {{ p }}
            </li>
          </ul>
        </dialog>
      </div>

      <div class="overflow-x-auto bg-bp_grayscale-600 rounded-box py-2 relative group">
        <table class="min-w-full table" style="min-width: 700px">
          <thead class="">
            <tr class="border-b border-bp_grayscale-500">
              <th
                class="py-3 px-4 text-center text-2xl text-bp_grayscale-400 font-semibold text-white sticky left-0 z-20 bg-bp_grayscale-600"
              >
                Disciplina
              </th>
              <th
                v-for="friend in friends"
                :key="friend.name"
                class="py-3 px-4 text-center text-sm font-semibold text-white"
                style="min-width: 120px"
              >
                <div class="flex flex-col gap-2 items-center">
                  <img
                    v-if="friend.imageUrl"
                    :src="friend.imageUrl"
                    alt=""
                    class="h-16 w-16 rounded-full object-cover"
                  />
                  <div
                    v-else
                    class="bg-bp_grayscale-500 rounded-full flex items-center justify-center w-12 h-12"
                  >
                    <v-icon name="fa-user-alt" class="text-white w-6 h-6" />
                  </div>
                  <span class="text-md">{{ friend.name }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="text-white">
            <tr
              v-for="subject in subjectsStatus"
              :key="subject.name"
              class="border-t border-bp_grayscale-500"
            >
              <td
                class="py-2 px-4 font-medium sticky text-xl left-0 z-10 bg-bp_grayscale-600"
                style="min-width: 220px"
              >
                <div
                  className="tooltip tooltip-right z-[1000] text-nowrap text-gray-200"
                  :data-tip="subject.code"
                >
                  <span>{{ subject.name }}</span>
                </div>
              </td>
              <td
                v-for="(status, idx) in subject.statuses"
                :key="idx"
                class="py-2 px-4 text-center text-lg"
                style="min-width: 120px"
              >
                <span
                  v-if="status != 'nao-pago'"
                  class="badge border-none text-white rounded-xl"
                  :class="statusClass(status)"
                  >{{ statusText(status) }}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, watch } from 'vue'

const period = ref('2025.2')

const friends = [
  {
    name: 'Isaac Anderson',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0005', 'DIM0010', 'DIM0020'],
    finished: ['']
  },
  {
    name: 'Luna Smith',
    imageUrl: null,
    interests: ['DIM0020'],
    finished: ['DIM0005', 'DIM0010']
  },
  {
    name: 'Oliver Johnson',
    imageUrl: null,
    interests: ['DIM0005', 'DIM0010', 'DIM0020'],
    finished: ['DIM0129']
  },
  {
    name: 'Mia Brown',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0010', 'DIM0020'],
    finished: ['DIM0005']
  },
  {
    name: 'Ethan Davis',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0005'],
    finished: ['DIM0010']
  },
  {
    name: 'Isaac Anderson',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0005', 'DIM0010', 'DIM0020'],
    finished: ['']
  },
  {
    name: 'Luna Smith',
    imageUrl: null,
    interests: ['DIM0020'],
    finished: ['DIM0005', 'DIM0010']
  },
  {
    name: 'Oliver Johnson',
    imageUrl: null,
    interests: ['DIM0005', 'DIM0010', 'DIM0020'],
    finished: ['DIM0129']
  },
  {
    name: 'Mia Brown',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0010', 'DIM0020'],
    finished: ['DIM0005']
  },
  {
    name: 'Ethan Davis',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0005'],
    finished: ['DIM0010']
  },
  {
    name: 'Isaac Anderson',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0005', 'DIM0010', 'DIM0020'],
    finished: ['']
  },
  {
    name: 'Luna Smith',
    imageUrl: null,
    interests: ['DIM0020'],
    finished: ['DIM0005', 'DIM0010']
  },
  {
    name: 'Oliver Johnson',
    imageUrl: null,
    interests: ['DIM0005', 'DIM0010', 'DIM0020'],
    finished: ['DIM0129']
  },
  {
    name: 'Mia Brown',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0010', 'DIM0020'],
    finished: ['DIM0005']
  },
  {
    name: 'Ethan Davis',
    imageUrl: null,
    interests: ['DIM0129', 'DIM0005'],
    finished: ['DIM0010']
  }
]

// Only a few rows for brevity. Add more as needed.
const subjects = [
  {
    code: 'DIM0005',
    name: 'Algoritmos e Estruturas de Dados'
  },
  {
    code: 'DIM0010',
    name: 'Programação Orientada a Objetos'
  },
  {
    code: 'DIM0020',
    name: 'Banco de Dados'
  },
  {
    code: 'DIM0129',
    name: 'Engenharia de Software'
  }
  // Add the rest of the subjects here, following the same structure
]

const subjectsStatus = ref([])

watch(() => {
  subjectsStatus.value = subjects.map((subject) => {
    return {
      name: subject.name,
      code: subject.code,
      statuses: friends.map((friend) => {
        if (friend.finished.includes(subject.code)) {
          return 'pago'
        } else if (friend.interests.includes(subject.code)) {
          return 'interesse'
        } else {
          return 'nao-pago'
        }
      })
    }
  })
})

// Helper for status text
function statusText(status) {
  switch (status) {
    case 'pago':
      return 'TÁ PAGO'
    case 'cursando':
      return 'CURSANDO'
    case 'interesse':
      return 'PAGAREI'
    case 'nao-pago':
      return 'NÃO'
    default:
      return ''
  }
}

function statusClass(status) {
  switch (status) {
    case 'pago':
      return 'bg-green-500'
    case 'cursando':
      return 'bg-blue-500'
    case 'interesse':
      return 'bg-[#F59E0B]'
    case 'nao-pago':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}
</script>
