<script setup>
import { ref} from "vue"
    defineProps(
        {
            title: String,
            likes: Number
        }
    )
    const count = ref(0)
</script>

<template>
    <button @click="count ++;" :likes="count">{{ count }} <span>{{ title }}</span></button>
</template>