<script setup>
    import EventComp from '../components/EventComp.vue';
    import { ref } from 'vue';
    const count = ref(0)
</script>
<template>
    <EventComp :increase-by="(n) => count += n"></EventComp>
</template>