<template>
    <div class="w-72 md:w-96 bg-bp_neutral-700 p-4 rounded-lg m-6">
        <header class="flex justify-between items-center mb-4">
            <p class="title-h1">Anúncios</p>
            <span class="text-sm text-bp_neutral-600">ver todos</span>
        </header>
        <div class="flex items-center gap-2">
            <div class="bg-bp_neutral-900 rounded-xl border border-bp_neutral-600 p-2">
                <v-icon name="md-notificationsnone-outlined" scale="1.5"></v-icon>
            </div>
            <div>
                <p>Manutenção do sistema</p>
                <span class="text-sm text-bp_neutral-500">O sistema ficará pausado dia 23.05 a partir das 15h</span>
            </div>
        </div>
        <div class="flex justify-center mt-6">
            <v-icon name="md-expandcircledown-outlined" scale="1.5"></v-icon>
        </div>
    </div>
</template>