<template>
    <div class="user-box">
      <el-avatar> {{username.slice(0,1).toUpperCase()}} </el-avatar>
      <span class="user-welcome-text">welcome , {{username}}</span>
    </div>
</template>

<script setup>
    /* import {useUserStatusStore} from '@/store/index'
    const store = useUserStatusStore() */
    const username = localStorage.getItem('userKey')

</script>

<style lang="scss">
    .user-box {
        font-weight: 700;
        display: flex;
        align-items: center;
        .user-welcome-text {
            margin-left: 5px;
            font-weight: 400;
        }
    }
</style>