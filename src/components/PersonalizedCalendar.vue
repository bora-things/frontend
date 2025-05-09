<script setup>
import "cally";
import { ref } from 'vue'

const isCalendarOpen = ref(false)

function handleCalendarClick() {
  isCalendarOpen.value = !isCalendarOpen.value
}

const enrollmentDates = ref();

async function fetchEnrollmentDates() {
  try {
    const response = await fetch('/src/assets/mocks/CalendarMockData.json');
    const data = await response.json();
    enrollmentDates.value = data;
  } catch (error) {
    console.error('Error fetching enrollment dates:', error);
  }
}
</script>

<template>
<div class="flex justify-end">
    <button class="relative bg-bp_neutral-800 border border-bp_neutral-600 rounded-full w-12 h-12" @click="handleCalendarClick">
        <div
            class="top-1 right-0 w-3 h-3 bg-bp_green-100 absolute rounded-full"
        ></div>
        <v-icon class="p-2" 
            name="md-calendartoday-round" scale="2"
            ></v-icon>
    </button>

    <div 
    v-if="isCalendarOpen"
    class="absolute right-3 bg-bp_neutral-800 p-4 rounded-md shadow-lg transition-all ease-in-out duration-300 w-[90%] md:w-auto max-h-[70vh] overflow-y-auto custom-scrollbar z-50"
    >
    <div class="flex justify-end">
        <button class="" @click="isCalendarOpen = false">
          <v-icon name="md-close" scale="1" />
        </button>
    </div>
        <calendar-date class="text-lg cally bg-bp_neutral-800">
            <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
            <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
            <calendar-month></calendar-month>
        </calendar-date>
        <div class="flex flex-wrap gap-2">
            <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-bp_green-100"></div>
                <p>Dia Atual</p>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-bp_primary-700"></div>
                <p>Matricula</p>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-bp_yellow-300"></div>
                <p>Rematricula</p>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-bp_pink-100"></div>
                <p>Extraordinária</p>
            </div>
        </div>
    </div>
</div>    
</template>

<style>
.cally ::part(button day today){
    color: #01D600 !important;
    background: transparent;
}
.cally ::part(selected){
    border:2px dashed #F80052 !important;
    background-color: transparent !important;
    color: #FFFFFF !important;
}
.cally ::part(day){
    border-radius: 100%;
    border: none;
    font-size: medium;
}
</style>