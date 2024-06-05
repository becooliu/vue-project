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
// import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref(null);

const validateUsername = (rule: any, value: String, callback: any) => {
  if (value === "") {
    callback(new Error("用户名不能为空。"));
  }
  callback();
};

const validatePass = (rule: any, value: any, callback: any) => {
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
  formEl.validate((valid) => {
    if (valid) {
      const data = {
        username: ruleForm.username,
        password: ruleForm.password,
      };
      instance
        .post("/user/login", data)
        .then((res) => {
          const { status, message } = res?.data;
          const type = status === 200 ? "success" : "error";
          if (res?.status === 200) {
            console.log(res);
            ElNotification({
              title: "注册帐号",
              message: message,
              type,
            });
          }
        })
        .catch((err) => {
          ElNotification({
            title: "注册帐号",
            message: err,
            type: "error",
          });
          throw new Error(err);
        });
    } else {
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
