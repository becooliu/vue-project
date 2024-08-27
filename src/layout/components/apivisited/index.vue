<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <div class="grid-content ep-bg-purple" />
            <el-card style="max-width: 480px">
                <template #header>
                    <div class="card-header">
                        <span>接口访问总数</span>
                    </div>
                </template>
                <p class="text item">{{ apiVisitedCount }}</p>
            </el-card>
        </el-col>

        <el-col :span="8">
            <div class="grid-content ep-bg-purple" />
            <BlogCount />
        </el-col>
    </el-row>
</template>

<script setup>
import BlogCount from '@/layout/components/apivisited/BlogCount.vue'
import instance from "@/axios/base";
import { ref } from 'vue'

const apiVisitedCount = ref(0)
instance.get('/getApiVisited').then(res => {
    apiVisitedCount.value = res.data.count
})
</script>