<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    router
  >
    <el-menu-item index="/">首页 </el-menu-item>
    <div class="flex-grow" />
    <!-- <el-menu-item index="1">Processing Center</el-menu-item> -->
    <el-sub-menu index="2">
      <template #title>用户管理</template>
        <template v-if="getUserIsAdmin && getLoginStatus">
          <el-menu-item index="/user/userlist">用户列表</el-menu-item>
          <el-menu-item index="2-3">重置密码</el-menu-item>
        </template>
        <el-menu-item index="/user/regist">注册账号</el-menu-item>
        <el-menu-item index="/user/login" v-if="!getLoginStatus">用户登录</el-menu-item>
      <el-menu-item index="/user/login" v-if="getLoginStatus" @click="logout">登出</el-menu-item>
      <!-- <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu> -->
    </el-sub-menu>
    <el-link href="/user/index" target="_self" v-if="!getUserIsAdmin && getLoginStatus">返回用户首页</el-link>
  </el-menu>
  <RouterView />
</template>

<script lang="ts" setup>
import { RouterView } from "vue-router";
import { ref } from "vue";
import {  deleteCookie } from "./utils";
import { storeToRefs } from 'pinia'

// 引入用户相关的state
import {useUserStatusStore} from '@/store/index'
const store = useUserStatusStore()
const { getLoginStatus, getUserIsAdmin } = storeToRefs(store)

console.log('App store', getLoginStatus.value, getUserIsAdmin.value)

const activeIndex = ref("1");

function setLogoutData(){
  localStorage.removeItem('userKey')
  deleteCookie('userInfo')
}

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

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
