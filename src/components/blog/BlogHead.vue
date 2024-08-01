<template>
    <div class="header-wrap">
        <el-link @click.prevent="goToList">返回博客列表</el-link>
        <div class="sublings">
            <p class="likes-title">猜你喜欢</p>
            <ul class="likes-lists">
                <li v-for="item in likesData" :key="item._id" @click="goToDetail(item._id)">{{ item.title }}</li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import router from '@/router'

defineProps({
    likesData: Array
})
const goToList = () => {
    router.push({ name: 'blog_list' })
}

const goToDetail = (_id) => {
    router.push({path: `/blog/details/${_id}`})
}
</script>

<style lang="scss">
.header-wrap {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 2rem 2.5rem;
    background-color: #eee;
    font-size: 14px;
}

.likes-title {
    
    line-height: 1.5rem;
}
.likes-lists {
    list-style: none;
    width: 15rem;
    max-width: 15rem;
    overflow: hidden;
    color: rgb(88, 144, 228);
    margin: 0;
    list-style: none;
    padding: 0;
    margin: 0;
    li {
        cursor: pointer;
        line-height: 1.5rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &:hover {
            color: rgb(57, 113, 196);
        }
    }

}
</style>