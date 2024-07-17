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
      <h3 class="user_form_title">创建角色</h3>
      <el-form-item label="角色" prop="role">
        <el-input v-model="ruleForm.role" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-input v-model="ruleForm.permissions" type="text" autocomplete="off" />
      </el-form-item>
      
      <el-divider />
  
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          添加
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref } from "vue";
  import instance from "@/axios/base";
  
  const ruleFormRef = ref(null);
  
  
  const ruleForm = reactive({
    role: "",
    permissions: ""
  });
  
  const validateRole = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("角色不能为空。"));
    }
    callback();
  }
  const validatePermissions = (rule, value, callback) => {
    if (value === "") {
      callback(new Error("角色名称不能为空。"));
    }
    callback();
  }
  
  
  const rules = reactive({
    role: [{ validator: validateRole, trigger: "blur" }],
    permissions: [{ validator: validatePermissions, trigger: "blur" }],
  });
  
  const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
      if (valid) {
        const data = {
          role: ruleForm.role,
          permissions: ruleForm.permissions
        };
        instance
          .post("/roles/create", data)
          .then((res) => {
            const { status, message } = res.data;
            const type = status === 200 ? "success" : "error";
            if (res?.status === 200) {
              console.log(res);
              // eslint-disable-next-line no-undef
              ElNotification({
                title: "创建角色",
                message: message,
                type,
              });
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-undef
            ElNotification({
              title: "创建角色",
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
  