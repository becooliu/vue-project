<script setup>
    import Grid from '../components/GridComp.vue'
    import { ref } from 'vue'

    const searchQuery = ref('')
    const gridColumns = ['name', 'power']

    const gridData = [
        { name: 'Chuck Norris', power: Infinity },
        { name: 'Bruce Lee', power: 9000 },
        { name: 'Jackie Chan', power: 7000 },
        { name: 'Jet Li', power: 8000 }
    ]
</script>

<template>
    <div class="flex-column">
        <form id="search">
            Search <input name="query" v-model="searchQuery" />
        </form>
        <Grid :data="gridData" :columns="gridColumns" :filter-key="searchQuery"/>
    </div>
</template>

<style>
    #search {
        padding: 20px 0;
    }
    .flex-column {
        display: flex;
        flex-direction: column;
    }
</style>
