<template>
  <div class="min-h-screen bg-bp_neutral-950 flex flex-col">
    <!-- Conteúdo principal -->
    <main class="flex flex-1 flex-col items-center justify-center px-4 md:px-8 lg:px-20">
      <div
        class="max-w-xl w-full bg-bp_neutral-900 rounded-2xl shadow-lg p-10 text-center border border-bp_neutral-700"
      >
        <h1 class="text-4xl font-bold text-bp_green-400 mb-4">Acesso Não Autorizado</h1>
        <p class="text-bp_neutral-200 text-lg mb-6">
          O sistema está em fase de testes e, por enquanto, apenas usuários autorizados
          podem acessar.
        </p>
        <p class="text-bp_neutral-400 mb-8">
          Em breve estará liberado para uso público! Fique ligado para novidades.
        </p>
        <button
          class="btn btn-ghost px-6 bg-bp_green-400 hover:bg-bp_green-500 text-white font-bold"
          @click="goToLandingPage"
        >
          Retornar à Landing Page
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
function goToLandingPage() {
  window.location.href = "/";
}

function handleLoginClick() {
  const authLink = import.meta.env.VITE_API_URL + "/oauth2/authorization/sigaa";
  window.location.href = authLink;
}
</script>

<style scoped>
.bg-bp_neutral-950 {
  background-color: #18181b;
}
.bg-bp_neutral-900 {
  background-color: #27272a;
}
.text-bp_green-400 {
  color: #22c55e;
}
.text-bp_neutral-200 {
  color: #e5e7eb;
}
.text-bp_neutral-400 {
  color: #9ca3af;
}
.border-bp_neutral-700 {
  border-color: #3f3f46;
}
.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-ghost {
  background: transparent;
}
.bg-bp_green-400 {
  background-color: #22c55e;
}
.hover\:bg-bp_green-500:hover {
  background-color: #16a34a;
}
.active\:bg-bp_green-500:active {
  background-color: #16a34a;
}
</style>
