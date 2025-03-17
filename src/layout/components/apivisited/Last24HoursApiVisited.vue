<template>
    <el-card style="max-width: 480px" shadow="hover">
        <template #header>
            <div class="card-header">
                <span>24小内接口访问量</span>
            </div>
        </template>
        <p class="text item custom">{{ last24HoursVisited }}</p>
    </el-card>
</template>

<script setup>
import instance from "@/axios/base";
import { ref } from 'vue'

const last24HoursVisited = ref(0)
instance.get('/get24HoursApiVisited').then(res => {
    last24HoursVisited.value = res.data.count
})
</script>