<script setup>
import BpButton from '@/components/BpButton.vue'
import CardComponent from '@/components/CardComponent.vue'
import CardDoubts from '@/components/CardDoubts.vue'
import SimboraImg from '@/components/SimboraImg.vue'
import { ArrowDownOutlined } from '@ant-design/icons-vue'
import { Image, Input } from 'ant-design-vue'
import { addIcons } from 'oh-vue-icons'
import { FaDiscord, FaInstagram } from 'oh-vue-icons/icons/fa'
import { onMounted, ref } from 'vue'
import { getComponents, getDoubts } from './LandingPageController'

const components = ref([])
const doubts = ref([])

onMounted(async () => {
  components.value = await getComponents()
  doubts.value = await getDoubts()
})

addIcons(FaInstagram, FaDiscord)

function handleLoginClick() {
  const authLink = import.meta.env.VITE_API_URL + '/oauth2/authorization/sigaa'

  window.location.href = authLink
}

function scrollToElement(id) {
  const element = document.getElementById(id)
  const headerOffset = document.querySelector('header').offsetHeight
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset

  window.scrollTo({
    top: offsetPosition - 100,
    behavior: 'smooth'
  })
}

onMounted(() => {
  document.querySelectorAll('a.nav-item').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const href = this.getAttribute('href').substring(1)
      scrollToElement(href)
    })
  })
})
</script>

<template>
  <div>
    <header
      class="flex justify-between place-items-center py-6 px-20 sticky top-0 w-full z-50 bg-bp_neutral-950"
    >
      <div class="flex place-items-center space-x-4">
        <SimboraImg />
        <p class="font-bold xl:text-3xl text-xl">BoraPagar</p>
      </div>
      <div class="space-x-6 hidden xl:flex">
        <a class="nav-item" href="#motivacao">Motivação</a>
        <a class="nav-item" href="#sobre">Sobre</a>
        <a class="nav-item" href="#criadores">Criadores</a>
      </div>
      <div>
        <BpButton class="px-6" type="green" size="small" @click="handleLoginClick"> Entrar </BpButton>
      </div>
    </header>
    <main class="h-full mx-auto bg-bp_neutral-800">
      <section class="bg-bp_neutral-950 border-b border-bp_neutral-600 px-4 md:px-8 lg:px-20 pb-20">
        <div class="grid grid-cols-2 items-center gap-8 py-12">
          <div class="space-y-8">
            <p class="text-4xl lg:text-5xl font-bold">
              <span class="text-bp_green-400">Simbora</span> organizar o seu semestre
            </p>
            <p class="text-bp_neutral-400">
              Gerencie seu curso, acompanhe seus resultados e se divirta no processo
            </p>
            <BpButton class="px-6" type="green" size="small"> Comece Agora </BpButton>
          </div>
          <div class="w-full flex justify-end">
            <Image
              class="max-w-[450px] max-h-[450px]"
              src="/images/ILUSTRACAO_SIMBORA.png"
              :preview="false"
            />
          </div>
        </div>
        <div class="relative w-full">
          <p
            class="md:text-xl font-semibold absolute -top-3 left-1/4 -translate-x-1/2 bg-bp_neutral-950 px-6 text-bp_neutral-200 before:content-[''] before:w-2 before:h-2 before:bg-bp_neutral-700 before:rounded-full before:absolute before:left-0 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:w-2 after:h-2 after:bg-bp_neutral-700 after:rounded-full after:absolute after:right-0 after:top-1/2 after:translate-x-1/2 after:-translate-y-1/2"
          >
            Um Projeto Oficial
          </p>
          <div
            class="flex justify-center items-center border border-bp_neutral-700 rounded-2xl w-full h-28 overflow-hidden space-x-4 md:space-x-20 px-4"
          >
            <Image class="object-contain" src="/images/ufrn-logo.png" :preview="false" />
            <Image class="object-contain" src="/images/Vector.png" :preview="false" />
            <Image class="object-contain" src="/images/logoSigaa.png" :preview="false" />
          </div>
        </div>
      </section>

      <div
        id="motivacao"
        class="text-bp_neutral-400 border-b border-bp_neutral-600 py-20 px-4 md:px-8 lg:px-20"
      >
        <div class="text-5xl text-center font-bold text-bp_neutral-200">
          <h1 class="mb-6">
            Com o <span class="text-bp_green-400">Bora Pagar</span> Você Consegue...
          </h1>
          <ArrowDownOutlined class="text-bp_neutral-700" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 md:gap-x-6 gap-y-3 md:gap-y-6 mt-20">
          <div
            class="bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-6 space-y-3 text-bp_neutral-50"
          >
            <v-icon name="md-inventory-outlined" scale="1.5" />
            <p class="text-lg text-bp_green-400 font-bold">Organização</p>
            <p>
              Organize suas matérias de forma prática e eficiente. Ajudamos a tentar se organizar da
              melhor forma possível em relação a horários, fazer um semestre balanceado e escolher
              as matérias ideais de acordo com seu objetivo.
            </p>
          </div>
          <div
            class="bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-6 space-y-3 text-bp_neutral-50"
          >
            <v-icon name="md-rule-sharp" scale="1.5" />
            <p class="text-lg text-bp_green-400 font-bold">Progresso</p>
            <p>
              Ajudamos o aluno em seu progresso acadêmico, monitorando e apoiando seu
              desenvolvimento ao longo do curso. Fornecemos uma visão geral das matérias já cursadas
              e das que ainda faltam cursar.
            </p>
          </div>
          <div
            class="bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-6 space-y-3 text-bp_neutral-50"
          >
            <v-icon name="md-managesearch" scale="1.5" />
            <p class="text-lg text-bp_green-400 font-bold">Matricula</p>
            <p>
              Ajudamos os alunos a se organizar durante o período de matrícula, como escolher quais
              matérias cursar, ver quais amigos vão cursar essas matérias e montar um semestre
              balanceado de acordo com suas necessidades.
            </p>
          </div>
          <div
            class="bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-6 space-y-3 text-bp_neutral-50"
          >
            <v-icon name="md-thumbupalt-sharp" scale="1.5" />
            <p class="text-lg text-bp_green-400 font-bold">Avaliação e feedbacks</p>
            <p>
              A plataforma auxilia os alunos na avaliação do corpo docente e das matérias,
              permitindo que os estudantes forneçam feedback sobre seus professores, disciplinas e o
              ambiente de aprendizado.
            </p>
          </div>
          <div
            class="bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-6 space-y-3 text-bp_neutral-50"
          >
            <v-icon name="md-description-outlined" scale="1.5" />
            <p class="text-lg text-bp_green-400 font-bold">Relatórios</p>
            <p>
              Relatórios para o DAAL visando um melhor entendimento das necessidades dos alunos em
              relação às matérias, suporte e eventos.
            </p>
          </div>
          <div
            class="bg-bp_neutral-700 border border-bp_neutral-600 rounded-xl p-6 space-y-3 text-bp_neutral-50"
          >
            <v-icon name="md-smarttoy-outlined" scale="1.5" />
            <p class="text-lg text-bp_green-400 font-bold">Chatbot Inteligente</p>
            <p>
              Imagina ter um sagui chamado Simbora sempre ao seu lado durante a graduação. O Simbora
              é uma IA que tá aqui pra ajudar você a navegar pelos desafios do curso, tipo escolher
              as matérias, organizar a grade, ou até planejar o que estudar em cada semestre.
            </p>
          </div>
        </div>
      </div>

      <section id="sobre" class="py-20 px-4 md:px-8 lg:px-20 bg-bp_neutral-950">
        <h1 class="text-5xl text-bp_neutral-200 mb-20">Tire Suas Dúvidas Aqui</h1>
        <div class="space-y-4">
          <CardDoubts v-for="doubt in doubts" :key="doubt.descriptionDoubt" :doubt="doubt" />
        </div>
      </section>

      <div id="criadores" class="py-20 px-4 md:px-8 lg:px-20 overflow-hidden relative">
        <p class="text-5xl text-bp_neutral-200 mb-20">Conheça Nosso Time</p>
        <div class="flex w-max gap-6 animate-marquee">
          <div v-for="i in 2" :key="i" class="flex gap-6">
            <CardComponent
              v-for="component in components"
              :key="component.name + i"
              :component="component"
            />
          </div>
        </div>
      </div>
    </main>

    <footer class="absolute bg-bp_neutral-900 w-full">
      <div class="flex place-items-start justify-between px-4 md:px-8 lg:px-16 py-10 space-y-8">
        <div class="flex place-items-center space-x-4">
          <SimboraImg />
          <p class="font-bold text-2xl">BoraPagar</p>
        </div>
        <div class="grid grid-cols-1 gap-y-4 md:gap-y-0 md:flex md:space-x-10 w-1/2">
          <div class="space-y-3">
            <p class="font-bold text-2xl">Contato</p>
            <p class="text-bp_neutral-400 text-sm">+55 21 9999-9999</p>
            <p class="text-bp_neutral-400 text-sm">contato@borapagar.com</p>
            <div class="flex space-x-2">
              <button><v-icon name="fa-instagram" scale="1.5" /></button>
              <button><v-icon name="fa-discord" scale="1.5" /></button>
            </div>
          </div>
          <div class="space-y-3 w-2/3">
            <p class="font-bold text-2xl">Dúvidas</p>
            <Input
              class="border-bp_neutral-600 bg-bp_neutral-900 text-neutral-50 placeholder:text-bp_neutral-400"
              placeholder="Mensagem..."
            />
            <div class="relative flex items-center">
              <v-icon name="md-email-outlined" scale="1.0" class="absolute text-bp_neutral-400" />
              <input
                class="w-full bg-bp_neutral-900 border-b-2 border-bp_neutral-400 py-2 text-bp_neutral-50 placeholder:text-bp_neutral-400 text-sm indent-8"
                type="text"
                placeholder="Seu email aqui"
              />
            </div>
            <div class="flex justify-end">
              <BpButton
                class="w-40 bg-bp_neutral-700 hover:bg-bp_neutral-800"
                type="primary"
                size="small"
                >Enviar</BpButton
              >
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-bp_neutral-700">
        <div class="flex justify-between px-4 md:px-16 lg:px-40 py-4 text-xs text-bp_neutral-400">
          <div>
            <p class="">Bora Pagar © Alguns direitos reservados</p>
          </div>
          <div class="flex space-x-10">
            <p>Sobre</p>
            <p>Termos de Uso</p>
            <p>Política de Privacidade</p>
          </div>
        </div>
      </div>
    </footer>
    <Image class="relative mt-20" src="/images/istockphoto.png" :preview="false" />
  </div>
</template>

<style>
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  white-space: nowrap;
  animation: marquee 50s linear infinite;
}
</style>
