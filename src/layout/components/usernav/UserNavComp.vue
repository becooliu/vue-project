<template>
    <el-menu :default-active="activeIndex" class="el-menu-custom" mode="horizontal" :ellipsis="false" router
        v-if="getLoginStatus">
        <el-sub-menu index="2">
            <template #title>
                <div class="user-box">
                    <el-avatar> {{ username?.slice(0, 1)?.toUpperCase() }} </el-avatar>
                    <span class="user-welcome-text">欢迎您, {{ username }}</span>
                </div>
            </template>
            <el-menu-item index="/blog/list">博客首页 </el-menu-item>
            <el-menu-item index="/blog/add">发布博客</el-menu-item>
            <template v-if="getUserIsAdmin">
                <el-menu-item index="/">网站管理</el-menu-item>
            </template>
            <el-menu-item index="/user/changeMyPassword">修改密码</el-menu-item>
            <el-menu-item index="/user/login" @click="logout">登出</el-menu-item>
        </el-sub-menu>

    </el-menu>
</template>

<script setup>
import { ref } from "vue"
import { setLogoutData } from "@/utils"
import { storeToRefs } from 'pinia'

const username = localStorage.getItem('userKey')

// 引入用户相关的state
import { useUserStatusStore } from '@/store/index'
const store = useUserStatusStore()
const { getLoginStatus, getUserIsAdmin } = storeToRefs(store)

console.log('App store', getLoginStatus.value, getUserIsAdmin.value)

const activeIndex = ref("1");

function logout() {
    store.userLogout()
    setLogoutData()

    ElNotification({
        title: "帐号登出",
        message: '账号登出成功',
        type: "success"
    })
}

</script>

<style lang="scss">
@import '@/styles/variable.scss';

.flex-grow {
    flex-grow: 1;
}

.el-menu-custom {
    height: $base-header-height;
    border-bottom: none;
}

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