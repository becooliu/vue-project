<template>
    <el-card style="max-width: 480px" shadow="hover">
        <template #header>
            <div class="card-header">
                <span>博客总数</span>
            </div>
        </template>
        <p class="text item custom">{{ blogAmount }}</p>
    </el-card>
</template>

<script setup>
import instance from "@/axios/base";
import { ref } from 'vue'

const blogAmount = ref(0)
instance.get('/blog/count').then(res => {
    const countData = res.data
    blogAmount.value = countData.reduce((acc, cur) => { acc += cur.count; return acc }, 0)
})
</script>