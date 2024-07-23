<template>
    <el-card style="max-width: 480px">
        <template #header>
            <div class="card-header">
                <span>接口访问总数</span>
            </div>
        </template>
        <p class="text item">{{ apiVisitedCount }}</p>
    </el-card>
</template>

<script setup>
import instance from "@/axios/base";
import { ref } from 'vue'

const apiVisitedCount = ref(0)
instance.get('/getApiVisited').then(res => {
    apiVisitedCount.value = res.data.count
})
</script>