<template>
  <main class="absolute w-full h-screen flex flex-col gap-10 items-center justify-center">
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-[10vh] text-gray-400 font-bold leading-tight">404</h1>
      <h2 class="text-[3vh] text-gray-400 font-bold leading-tight">
        Página não encontrada
      </h2>
    </div>
    <p class="text-2xl text-gray-300">
      Oops! Parece que a página que você está procurando não existe ou foi movida.
    </p>
    <router-link
      to="/dashboard"
      class="btn btn-lg bg-bp_green-500 border-none text-white hover:bg-bp_green-600"
    >
      Voltar para a página inicial</router-link
    >
  </main>
</template>

<script setup>
// Nenhuma lógica necessária para esta página simples
</script>
