<template>
    <el-row :gutter="20">
        <el-col :span="8">
            <ApiVisited />
        </el-col>

        <el-col :span="8">
            <BlogCount />
        </el-col>
    </el-row>
</template>

<script setup>
import BlogCount from '@/layout/components/apivisited/BlogCount.vue'
import ApiVisited from '@/layout/components/apivisited/ApiVisited.vue'
import instance from "@/axios/base";
import { ref } from 'vue'

const apiVisitedCount = ref(0)
instance.get('/getApiVisited').then(res => {
    apiVisitedCount.value = res.data.count
})
</script>