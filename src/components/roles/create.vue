<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="custom-ruleForm">
    <h3 class="user_form_title">创建角色</h3>
    <el-text class="role-tips" type="info">当前已有角色：admin, editor, user, viewer</el-text>
    <br />
    <el-form-item label="角色">
      <!-- <el-input v-model="ruleForm.role" type="text" autocomplete="off" /> -->

      <el-select v-model="roleName" placeholder="Select" @change="roleChange" style="width: 240px">
        <el-option v-for="item in ruleForm" :key="item._id" :label="item.role" :value="item.role" />
        <template #footer>
          <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
            添加新角色
          </el-button>
          <template v-else>
            <el-input v-model="optionName" class="option-input" placeholder="input option name" size="small" />
            <el-button type="primary" size="small" @click="onConfirm">
              确认
            </el-button>
            <el-button size="small" @click="clear">取消</el-button>
          </template>
        </template>
      </el-select>

    </el-form-item>
    <el-form-item label="权限" prop="permissions">
      <el-tag v-for="tag in currentPermission" class="permission-tag" :key="tag" @close="handleClose(tag)" closable>
        {{ tag }}
      </el-tag>
      <el-input v-if="inputVisible" class="new-permission-input" ref="inputRef" v-model="inputValue"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />

      <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">添加权限</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确认修改
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue";
import type { CheckboxValueType } from 'element-plus'
import instance from "@/axios/base";
import type { InputInstance } from "element-plus";

const ruleFormRef = ref(null);
const roleName = ref<CheckboxValueType[]>([])

const ruleForm = ref(null)
const isAdding = ref(false)

//权限相关
const inputValue = ref('')
const inputVisible = ref(false)
const inputRef = ref<InputInstance>()


// const initialRoles = ref([])

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

// role 变化同步permission
const currentPermission = ref(null)
function roleChange(e) {
  console.log('ruleForm.value', ruleForm.value)
  currentPermission.value = ruleForm.value.find(item => item?.role == e) ? ruleForm.value.find(item => item?.role == e)?.permissions : ''
  console.log('currentPermission', currentPermission.value)
}

//权限相关操作
const handleClose = (tag: string) => {
  currentPermission.value.splice(currentPermission.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value!.input!.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    currentPermission.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 验证操作
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
      const data = ruleForm
      console.log('AAAAAA', data)
      return;
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
.permission-tag {
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
  