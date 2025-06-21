<template>
  <button
    className="btn btn-sm bg-transparent text-white shadow-none w-fit self-end hover:bg-bp_grayscale-600 hover:shadow-lg
     hover:scale-105 transition-all duration-300"
    @click="openDialog"
  >
    <v-icon name="fa-users" class="text-white w-6 h-6 mr-2" />
    Interesses dos Amigos
  </button>
  <dialog ref="dialogRef" class="p-5 w-full modal">
    <div
      class="modal-box p-0 min-w-[95%] max-h-[95%] shadow-lg rounded-lg overflow-hidden flex flex-col gap-5"
    >
      <div class="overflow-x-auto bg-bp_grayscale-600 rounded-box relative group p-4 pl-0">
        <table class="min-w-full table" style="min-width: 700px">
          <thead class="">
            <tr class="border-b border-bp_grayscale-700">
              <th
                class="py-3 px-4 text-center text-2xl text-bp_grayscale-400 font-semibold text-white sticky left-0 z-20"
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
              class="border-t border-bp_grayscale-700"
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
    <form method="dialog" className="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const dialogRef = ref(null)

function openDialog() {
  dialogRef.value?.showModal()
}

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
  },
  {
    code: 'DIM0030',
    name: 'Estruturas Discretas'
  },
  {
    code: 'DIM0040',
    name: 'Cálculo I'
  },
  {
    code: 'DIM0050',
    name: 'Cálculo II'
  },
  {
    code: 'DIM0060',
    name: 'Probabilidade e Estatística'
  },
  {
    code: 'DIM0070',
    name: 'Sistemas Operacionais'
  },
  {
    code: 'DIM0080',
    name: 'Redes de Computadores'
  },
  {
    code: 'DIM0090',
    name: 'Compiladores'
  },
  {
    code: 'DIM0100',
    name: 'Inteligência Artificial'
  },
  {
    code: 'DIM0110',
    name: 'Computação Gráfica'
  },
  {
    code: 'DIM0130',
    name: 'Empreendedorismo em TI'
  },
  {
    code: 'DIM0140',
    name: 'Gestão de Projetos'
  },
  {
    code: 'DIM0150',
    name: 'Linguagens Formais e Autômatos'
  },
  {
    code: 'DIM0160',
    name: 'Teoria da Computação'
  },
  {
    code: 'DIM0170',
    name: 'Computação em Nuvem'
  },
  {
    code: 'DIM0180',
    name: 'Desenvolvimento Web'
  },
  {
    code: 'DIM0190',
    name: 'Desenvolvimento Mobile'
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
