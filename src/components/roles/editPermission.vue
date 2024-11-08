<template>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="custom-ruleForm">
        <h3 class="user_form_title">权限管理</h3>
        <el-form-item label="角色">
            <!-- <el-input v-model="ruleForm.role" type="text" autocomplete="off" /> -->

            <el-select v-model="roleName" placeholder="Select" @change="roleChange" style="width: 240px">
                <el-option v-for="item in ruleForm" :key="item._id" :label="item.role" :value="item.role" />
                <!-- <template #footer>
                    <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
                        添加新角色
                    </el-button>
                    <template v-else>
                        <el-input v-model="optionName" class="option-input" placeholder="input option name"
                            size="small" />
                        <el-button type="primary" size="small" @click="onConfirm">
                            确认
                        </el-button>
                        <el-button size="small" @click="clear">取消</el-button>
                    </template>
</template> -->
            </el-select>

        </el-form-item>
        <el-form-item label="权限" prop="permissions">
            <el-tag v-for="tag in currentPermission" class="permission-tag" :key="tag" @close="handleClose(tag)"
                closable>
                {{ tag }}
            </el-tag>
            <el-input v-if="inputVisible" class="new-permission-input" ref="inputRef" v-model="inputValue"
                @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />

            <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">添加权限</el-button>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm">
                确认修改
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, watch } from "vue";
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

/**
 * role 变化同步permission
 * 
 *  */

let currentId = ref('')
const currentRole = ref('') // 定义select role 变化时被选中的role
const currentPermission = ref(null) // 用于保存当前选中的role 对应的权限

watch(() => roleName.value, () => {
    currentId.value = ruleForm.value?.find(item => item.role == currentRole.value)?._id
})

function roleChange(e) {
    currentRole.value = e
    currentPermission.value = ruleForm.value.find(item => item?.role == e) ? ruleForm.value.find(item => item?.role == e)?.permissions : ''
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

const submitForm = () => {
    if (!currentRole.value) {
        ElNotification({
            title: "更新权限失败",
            message: "没有选择角色数据，请确认。",
            type: "error"
        })
        return
    }
    if (!currentPermission.value.length) {
        ElNotification({
            title: "更新权限失败",
            message: "权限数据不能为空，请确认。",
            type: "error"
        })
        return
    }
    const params = {
        _id: currentId.value,
        role: currentRole.value,
        permissions: currentPermission.value
    }

    instance.post('/permission/update', params).then(res => {
        const { status, message } = res.data
        if (status === 200) {
            ElNotification({
                title: "更新权限成功",
                message,
                type: "success"
            })
            return
        }
        ElNotification({
            title: "更新权限失败",
            message,
            type: "error"
        })
    })
}

const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
}
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