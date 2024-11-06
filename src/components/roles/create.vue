<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="custom-ruleForm">
    <h3 class="user_form_title">创建角色</h3>

    <div class="header">
      <el-text class="role-tips" type="success">当前已有角色：</el-text>
      <el-tag v-for="item in ruleForm" :key="item._id" class="role-tag">{{ item.role }}</el-tag>
    </div>

    <el-form-item label="角色" prop="role">
      <el-input v-model="newRole" type="text" autocomplete="off" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm()">新增角色</el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import instance from "@/axios/base";

const ruleFormRef = ref(null);

const ruleForm = ref(null)

//角色相关
const newRole = ref('')

function getAllRoles() {
  instance.get('/roles/getAll').then(res => {
    if (res?.data?.length) return
    ruleForm.value = res.data.pageData
  }).catch(err => {
    console.log(err)
    return err
  })
}

getAllRoles()

// 验证操作
const validateRole = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("角色不能为空。"));
  }
  callback();
}

const rules = reactive({
  role: [{ required: true, validator: validateRole, trigger: "blur" }]
});

const submitForm = () => {
  if (!newRole.value.length) {
    ElNotification({
      title: "新增角色失败",
      message: "没有角色数据，请确认。",
      type: "error"
    })
    return
  }
  const params = {
    role: newRole.value
  }

  instance.post('/roles/add', params).then((result) => {
    const res = result.data
    if (res.status === 200) {
      ruleForm.value.push({
        _id: res.roleData._id,
        role: res.roleData.role
      })

      ElNotification({
        title: "新增角色成功",
        message: `新增角色 ${res.roleData.role} 成功`,
        type: "success"
      })
    } else {
      ElNotification({
        title: "新增角色失败",
        message: `${res.message}`,
        type: "error"
      })
    }
  })
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 1em;
}

.permission-tag,
.role-tag {
  margin-right: 0.5em;
}

.new-permission-input {
  margin-top: 1em;
}
.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>
  