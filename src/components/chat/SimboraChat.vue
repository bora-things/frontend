<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'

import ChatMessage from './ChatMessage.vue'
import SimboraImg from '../SimboraImg.vue'

const isChatOpened = ref(false)
const messages = ref([])
const currentUserMessage = ref('')
const textarea = ref(null)
const isAwaitingSimbora = ref(false)
let messageId = 0
const { VITE_SIMBORA_API_URI } = import.meta.env
const showSimboraHelpOffer = ref(false)
const oneMinute = 60 * 1000
const tenSeconds = 10 * 1000

setInterval(() => {
  showSimboraHelpOffer.value = !showSimboraHelpOffer.value
}, oneMinute)

watch(showSimboraHelpOffer, () => {
  setTimeout(() => {
    if (showSimboraHelpOffer.value) {
      showSimboraHelpOffer.value = false
    }
  }, tenSeconds)
})

function chatToggler() {
  isChatOpened.value = !isChatOpened.value
}

function updateMessagesList(message, user) {
  const d = new Date().toLocaleTimeString()
  const [hours, minutes] = d.split(':')

  const newMessage = {
    id: messageId++,
    author: user,
    content: message,
    sentAt: `${hours}:${minutes}`
  }

  messages.value.push(newMessage)
  currentUserMessage.value = ''
}

function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }

  if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault()
    currentUserMessage.value = currentUserMessage.value.concat('\n')
  }
}

async function sendMessage() {
  const query = textarea.value.value.trim()

  if (query.length === 0) {
    return
  }

  updateMessagesList(query, 'Tiago')

  setTimeout(() => {
    updateMessagesList('Digitando...', 'simbora')
  }, 500)

  try {
    isAwaitingSimbora.value = true

    const apiResponse = await axios({
      method: 'get',
      url: VITE_SIMBORA_API_URI,
      params: {
        query: query
      }
    })

    messages.value.pop()

    if (apiResponse.status === 200) {
      updateMessagesList(apiResponse.data, 'simbora')
    } else {
      updateMessagesList('Infelizmente não consegui buscar esta informação', 'simbora')
    }
  } catch (error) {
    setTimeout(() => {
      messages.value.pop()
      updateMessagesList('Infelizmente não consegui buscar esta informação', 'simbora')
    }, 1000)

    console.error(error)
  } finally {
    isAwaitingSimbora.value = false
  }
}
</script>

<template>
  <button
    type="button"
    @click="chatToggler"
    v-if="!isChatOpened"
    class="fixed z-40 bottom-10 right-10 flex items-center gap-4"
  >
    <div
      class="relative transition-all duration-400"
      :class="{ 'opacity-100': showSimboraHelpOffer, 'opacity-0 hidden': !showSimboraHelpOffer }"
    >
      <v-icon
        name="md-playarrow"
        class="rotate-90 absolute -top-2.5 -right-3 -z-10 text-bp_neutral-700"
        scale="1.5"
      />
      <div
        class="bg-bp_neutral-700 px-4 rounded-l-md rounded-br-md text-sm h-16 flex flex-col justify-center items-center font-bold"
      >
        <p class="flex items-center gap-1 text-xs mb-1 w-full">
          <span class="w-2 h-2 bg-green-400 rounded-full"></span>
          <span class="text-bp_neutral-400">Simbora</span>
        </p>
        <span>Precisando de uma mãozinha ?</span>
      </div>
    </div>

    <SimboraImg size="large" />
  </button>
  <article
    class="fixed bottom-10 right-5 md:right-10 h-4/5 z-40 border border-bp_neutral-700 rounded-lg max-w-sm md:max-w-md w-full text-sm bg-bp_neutral-800"
    v-else
  >
    <div class="flex flex-col justify-between w-full h-full">
      <header
        class="w-full h-20 p-4 border-b bg-bp_neutral-900 bg-opacity-20 border-bp_neutral-700 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <SimboraImg />
          <div class="flex flex-col">
            <h4 class="text-xl font-bold">Simbora</h4>
            <p class="flex items-center gap-1 text-xs mt-1">
              <span class="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Online</span>
            </p>
          </div>
        </div>

        <button type="button" @click="chatToggler">
          <v-icon name="md-close" />
        </button>
      </header>

      <main class="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
        <div class="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
          <ChatMessage
            v-for="message in messages"
            :key="message.id"
            :author="message.author"
            :sentAt="message.sentAt"
          >
            <span>{{ message.content }}</span>
          </ChatMessage>
        </div>

        <div class="w-full p-4 flex items-center gap-4">
          <textarea
            autocomplete="off"
            name="message"
            placeholder="Mensagem"
            class="w-full border border-bp_neutral-600 rounded-full resize-none overflow-hidden bg-transparent px-4 py-3 h-12 placeholder:text-bp_neutral-600"
            v-model="currentUserMessage"
            :disabled="isAwaitingSimbora"
            ref="textarea"
            @keypress="handleKeyPress"
          >
          </textarea>
          <button
            size="small"
            class="w-10 p-0 bg-blue-500 btn border-none text-white flex items-center justify-center"
            style="border-radius: 9999px !important"
            @click="sendMessage"
            :disabled="isAwaitingSimbora"
          >
            <v-icon name="md-send"/>
        </button>
        </div>
      </main>
    </div>
  </article>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #505050;
}

::-webkit-scrollbar-thumb {
  background-color: #323232;
  border-radius: 20px;
}
</style>
