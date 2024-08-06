<template>
    <el-card style="max-width: 480px">
        <template #header>
            <div class="card-header">
                <span>博客分类统计</span>
            </div>
        </template>
        <p class="text item"></p>
    </el-card>
</template>

<script setup>
import instance from "@/axios/base";
import { ref } from 'vue'

// const apiVisitedCount = ref(0)
instance.get('/blog/count').then(res => {
    console.log(res.data)
    // apiVisitedCount.value = res.data.count
})
</script>