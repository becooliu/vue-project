<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="custom-ruleForm">
    <h3 class="user_form_title">创建角色</h3>
    <el-text class="role-tips" type="info">当前已有角色：admin, editor, user, viewer</el-text>
    <br />
    <el-form-item label="角色">
      <!-- <el-input v-model="ruleForm.role" type="text" autocomplete="off" /> -->

      <el-select v-model="ruleForm" placeholder="Select" style="width: 240px">
        <el-option v-for="item in ruleForm" :key="item._id" :label="item.role" :value="item.role" />
        <template #footer>
          <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
            Add an option
          </el-button>
          <template v-else>
            <el-input v-model="optionName" class="option-input" placeholder="input option name" size="small" />
            <el-button type="primary" size="small" @click="onConfirm">
              confirm
            </el-button>
            <el-button size="small" @click="clear">cancel</el-button>
          </template>
        </template>
      </el-select>

    </el-form-item>
    <!-- <el-form-item label="权限" prop="permissions">
      <el-input v-model="ruleForm.permissions" type="text" autocomplete="off" />
    </el-form-item> -->

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


const ruleForm = ref(null)
const isAdding = ref(false)

// const initialRoles = ref([])

const getAllRoles = async () => {

  const roles = await instance.get('/roles/getAll')
  // console.log('33333', roles)
  if (!roles?.data?.length) return

  ruleForm.value = roles.data
}

getAllRoles()

/* function getInitialRoles() {

  if (ruleForm.value) {
    ruleForm.value.every(item => { initialRoles.value.push(item.role) })
    console.log('initialRoles', initialRoles)
  }
}
getInitialRoles() */

const onAddOption = () => {
  isAdding.value = true
}

const optionName = ref('')
const onConfirm = () => {
  if (optionName.value) {
    ruleForm.value.push({
      role: optionName.value,
      permissions: optionName.value,
    })
    clear()
  }
}

const clear = () => {
  optionName.value = ''
  isAdding.value = false
}

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
      const data = ruleForm;
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

<style lang="scss" scoped>
.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>
  