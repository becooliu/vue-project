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
      <template #title index="/user">用户管理</template>
      <el-menu-item index="/user/regist">注册账号</el-menu-item>
      <el-menu-item index="/user/login">用户登录</el-menu-item>
      <el-menu-item index="2-3">重置密码</el-menu-item>
      <el-menu-item index="2-4">登出</el-menu-item>
      <!-- <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu> -->
    </el-sub-menu>
  </el-menu>
  <RouterView />
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
