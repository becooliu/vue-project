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
    <h3 class="user_form_title">注册账号</h3>
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
    <el-form-item label="Confirm" prop="checkPass">
      <el-input
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        注册
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import instance from "@/axios/base";
// import { ElNotification } from "element-plus";
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
  } else {
    if (ruleForm.checkPass !== "") {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField("checkPass");
    }
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== ruleForm.password) {
    callback(new Error("两次密码不一致!"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  username: "",
  password: "",
  checkPass: "",
});

const rules = reactive({
  username: [{ validator: validateUsername, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
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
        .post("/user/create", data)
        .then((res) => {
          const { status, message } = res.data;
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
