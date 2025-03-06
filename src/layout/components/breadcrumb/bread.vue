<template>
    <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item class="item" v-for="(item, index) in breadcrumbData" :key="item.path">
            <!--不可点击项-->
            <span v-if="index === breadcrumbData.length - 1" class="no-redirect">{{ item.meta.title }}</span>
            <!--可点击项-->
            <a v-else class="redirect" @click.prevent="onLinkClick(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const breadcrumbData = ref([])

const getBreadcrumbData = () => {
    breadcrumbData.value = route.matched.filter(item => item?.meta && item.meta.title)
}

// 监听路由变化时触发
watch(
    route,
    () => {
        getBreadcrumbData()
    },
    { immediate: true }
)

const router = useRouter()

const onLinkClick = item => {
    router.push(item.path)
}
</script>

<style lang="scss">
@import '@/styles/variable.scss';

.breadcrumb {
    display: inline-block;
    height: $base-header-height;

    .item {
        height: $base-header-height;
        line-height: $base-header-height;
    }

    .no-direct {
        color: #97a8be;
        cursor: text;
    }

    .direct {
        color: #666;
        font-weight: 600;
    }
}
</style>
