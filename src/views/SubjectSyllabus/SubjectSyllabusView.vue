<template>
  <div class="text-white p-6 min-h-screen">
    <div class="max-w-5xl mx-auto bg-bp_neutral-800 border-2 border-bp_neutral-600 rounded-lg p-6">
      <div class="flex justify-between">
        <h1 class="text-2xl font-bold mb-2">Princípios de Legislação Aplicáveis à Tecnologia da Informação e Comunicação de Dados</h1>
        <v-icon name="md-close-round" scale="1.5"/>
      </div>
        <div class="flex justify-between items-center">
            <div class="flex flex-wrap text-sm mb-4 gap-2">
                <span class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1">
                Código: DB0040B
                </span>
                <span class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1">
                Carga Horária: 90H
                </span>
                <span class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md px-3 py-1">
                Tipo: Optativa
                </span>
            </div>
            
            <button class="bg-bp_green-500 px-2 py-1 rounded mb-6">
                + Adicionar à Grade
            </button>
        </div>


      <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md mb-8 p-4">
        <h2 class="text-xl font-semibold mb-2">Ementa da Disciplina</h2>
        <p class="text-sm text-gray-300">
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
          Estudo dos fundamentos legais que regem o uso da Tecnologia da Informação e Comunicação (TIC)...
        </p>
      </section>

      <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md mb-8 p-4">
        <h2 class="text-xl font-semibold text-center mb-4">Professores Prováveis</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
                v-for="(prof, index) in professores"
                :key="index"
                class="bg-bp_neutral-825 border border-bp_neutral-600 p-2 rounded flex items-center space-x-3"
            >
                <img :src="prof.foto" alt="Foto do professor" class="rounded-full w-12 h-12 object-cover" />
                <div>
                <p>{{ prof.nome }}</p>
                <p class="text-sm">
                    Aprovação:
                    <span :class="getCorAprovacao(prof.aprovacao)">{{ prof.aprovacao }}%</span>
                </p>
                </div>
            </div>
        </div>
      </section>

      <section class="bg-bp_neutral-850 border border-bp_neutral-600 rounded-md p-4">
        <h2 class="text-xl font-semibold text-center mb-4">Amigos Interessados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div v-for="(amigo, index) in amigos" :key="index" class="bg-bp_neutral-825 border border-bp_neutral-600 p-2 rounded flex items-center space-x-3">
            <img :src="amigo.avatar" class="rounded-full w-12 h-12" />
            <div>
              <p>{{ amigo.nome }}</p>
              <p class="text-sm text-gray-300">{{ amigo.curso }} <span class="text-bp_neutral-400">{{ amigo.periodo }}</span></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amigos: [
        {
          nome: 'Sandra Azevedo Fonseca Dantas Martins',
          curso: 'BTI',
          periodo: '2º Período',
          avatar: 'https://via.placeholder.com/40'
        },
        {
          nome: 'Raimunda Gomes',
          curso: 'Enfermagem',
          periodo: '2º Período',
          avatar: 'https://via.placeholder.com/40'
        },
      ],
      professores: [
        {
          nome: "Sandra Azevedo Fonseca Dantas Martins",
          aprovacao: 55,
          foto: "https://via.placeholder.com/48/4ade80/000000?text=S"
        },
        {
          nome: "Maria Lopes Shnieder",
          aprovacao: 78,
          foto: "https://via.placeholder.com/48/4ade80/000000?text=M"
        },
        {
          nome: "Edmara Alencar Madhouy Irene de Souza Bastos",
          aprovacao: 91,
          foto: "https://via.placeholder.com/48/4ade80/000000?text=E"
        }
      ]
    };
  },
  methods: {
    getCorAprovacao(aprovacao) {
      if (aprovacao <= 60) {
        return 'text-red-500';
      } else if (aprovacao <= 80) {
        return 'text-yellow-400';
      } else {
        return 'text-bp_green-600';
      }
    }
  }
};
</script>