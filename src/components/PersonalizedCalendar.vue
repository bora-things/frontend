<script>
import "cally";
</script>

<template>
    <calendar-date class="cally bg-bp_neutral-900 border border-base-300 shadow-lg rounded-box">
        <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
        <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
        <calendar-month></calendar-month>
    </calendar-date>
</template>

<style>
.cally ::part(button day today){
    background-color: #01D600 !important;
}
.cally ::part(selected){
    border:2px dashed #F80052 !important;
    background-color: transparent !important;
    color: #FFFFFF !important;
}
.cally ::part(day){
    border-radius: 100%;
    border: none;
}
</style>