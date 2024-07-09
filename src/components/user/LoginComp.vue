<!-- eslint-disable no-undef -->
<template>
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
  >
    <h3 class="user_form_title">用户登录</h3>
    <el-form-item label="账号" prop="username">
      <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        登录
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
  <el-row justify="end">
    <el-col :span="6"
      ><el-link href="/user/regist">没有账号？立即注册</el-link></el-col
    >
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import instance from "@/axios/base";
import router from "@/router";

// 引入用户相关的state
import {useUserStatusStore} from '@/store/index'
import { setCookie } from "@/utils";
// import { ElNotification } from "element-plus";
const store = useUserStatusStore()

// import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref(null);

const validateUsername = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("用户名不能为空。"));
  }
  callback();
};

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  }
  callback();
};

const ruleForm = reactive({
  username: "",
  password: "",
});

const rules = reactive({
  username: [{ validator: validateUsername, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const data = {
        username: ruleForm.username,
        password: ruleForm.password,
      };
      try {
        const loginResponse = await instance.post("/user/login", data)

        // console.log('after login res: ', loginResponse)
        const { status, message } = loginResponse.data;
        const { username, _id, isAdmin, role } = loginResponse.data.user
        const type = status === 200 ? "success" : "error";
        if (status === 200) {
          console.log(loginResponse);
          ElNotification({
            title: "帐号登录",
            message: message,
            type,
          });
          
          console.log('isAdmin', isAdmin)
          // 登录成功后，设置相关的状态
          const userStoreData = {
            username,
            isAdmin
          }
          store.afterLogin(userStoreData)
          store.setUserPermissions(role.permissions)
          store.setUserRole(role.role)
          const userInfo = {username, _id}
          // 登录成功后设置cookie 1天后失效
          setCookie('userInfo', JSON.stringify(userInfo), 1)
          if(isAdmin) {
            router.push({path: '/admin/index'})

          }else {
            router.push({path: '/user/userlist'})

          }
        } else {
          ElNotification({
            title: "帐号登录",
            message,
            type: "error",
          });
        }
    }catch(err) {
      throw new Error(err)
    }
      
      /* instance
        .post("/user/login", data)
        .then((res) => {
          console.log('after login res: ', res)
          const { status, message, username } = res.data;
          const type = status === 200 ? "success" : "error";
          if (res?.status === 200) {
            console.log(res);
            ElNotification({
              title: "帐号登录",
              message: message,
              type,
            });
            
            // 登录成功后，设置相关的状态
            store.afterLogin(username)
            
          }
        })
        .catch((err) => {
          ElNotification({
            title: "帐号登录",
            message: err,
            type: "error",
          });
          throw new Error(err);
        }); */
    } else {
      ElNotification({
        title: "帐号登录",
        message: '登录失败，请核对你填写的数据是否正确。',
        type: "error",
      });
      console.log("error submit!");
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped></style>
