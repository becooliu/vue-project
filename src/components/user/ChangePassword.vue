<!-- eslint-disable no-undef -->
<template>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="custom-ruleForm"
        @keyup.enter="submitForm(ruleFormRef)">
        <h3 class="user_form_title">修改密码</h3>
        <el-form-item label="旧密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newpass">
            <el-input v-model="ruleForm.newpass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="repass">
            <el-input v-model="ruleForm.repass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">
                修改密码
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
    </el-form>
    <el-row justify="end">
        <el-col :span="6"><el-link href="/user/regist">没有账号？立即注册</el-link></el-col>
        <el-col :span="6"><el-link href="/user/login">有账号？立即登录</el-link></el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import instance from "@/axios/base";
import router from "@/router";

// 引入用户相关的state
import { useUserStatusStore } from '@/store/index'
import { setLogoutData } from "@/utils";
// import { ElNotification } from "element-plus";
const store = useUserStatusStore()

// import type { FormInstance, FormRules } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>();

const validatePass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("旧密码不能为空"));
    }
    callback();
};


const validateNewPass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("新密码不能为空。"));
    } else {
        if (ruleForm.newpass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('newpass')
        }
    }
    callback();
};

const validateRePass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("确认密码不能为空。"));
    } else if (value !== ruleForm.newpass) {
        callback(new Error('两次密码不一致！'))
    } else {
        callback();
    }
};

const ruleForm = reactive({
    password: "",
    newpass: "",
    repass: "",
});

const rules = reactive<FormRules<typeof ruleForm>>({
    password: [{ validator: validatePass, trigger: 'blur' }],
    newpass: [{ validator: validateNewPass, trigger: 'blur' }],
    repass: [{ validator: validateRePass, trigger: 'blur' }],
})

/* const rules = reactive({
    password: [{ validator: validatePass, trigger: "blur" }],
    newpass: [{ validator: validateNewPass, trigger: "blur" }],
    repass: [{ validator: validateRePass, trigger: "blur" }]
}); */

const submitForm = (formEl) => {
    if (!formEl) return;
    formEl.validate(async (valid) => {
        if (valid) {
            const data = {
                password: ruleForm.password,
                newpass: ruleForm.newpass,
                repass: ruleForm.repass,
                username: localStorage.getItem('userKey'),
                userId: localStorage.getItem('userId')
            };
            try {
                const changePasswordResponse = await instance.post("/user/change_password", data)

                console.log('changePasswordResponse ', changePasswordResponse)
                const { status, message } = changePasswordResponse.data;
                const type = status === 200 ? "success" : "error";
                if (status === 200) {
                    console.log(changePasswordResponse);
                    ElNotification({
                        title: "修改密码",
                        message,
                        type,
                    });

                    // 修改密码成功后，设置相关的状态
                    store.userLogout()
                    setLogoutData()

                } else {
                    ElNotification({
                        title: "修改密码",
                        message,
                        type: "error",
                    });
                }
            } catch (err) {
                throw new Error(err)
            }

        } else {
            ElNotification({
                title: "修改密码",
                message: '提交数据失败，请核对你填写的确认密码是否一致，或其它数据是否正确。',
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
