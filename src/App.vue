<template>
    <el-row>
      <el-col :span="24">
        <router-view></router-view>
      </el-col>
    </el-row>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStatusStore } from './store';

const store = useUserStatusStore()
const {getLoginStatus} = storeToRefs(store)
console.log('getLoginStatus', getLoginStatus)

/* const isLogin = store.getLoginStatus
console.log('App.vue isLogin', isLogin) */

</script>