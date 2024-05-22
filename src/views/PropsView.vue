<script setup>
    import PropsComp from '../components/PropsComp.vue';
</script>

<template>
    <main>
        <PropsComp :title="new Date().getTime()"/>
    </main>
</template>