<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="custom-ruleForm">
    <h3 class="user_form_title">新增博客分类</h3>
    <el-form-item label="分类名" prop="categoryName">
      <el-input v-model="ruleForm.categoryName" type="text" autocomplete="off" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        添加
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import instance from '@/axios/base'

const ruleFormRef = ref(null)

const ruleForm = reactive({
  categoryName: ''
})

const validateCategoryName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('分类名不能为空。'))
  }
  callback()
}

const rules = reactive({
  categoryName: [{ validator: validateCategoryName, trigger: 'blur' }]
})

const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      const data = {
        categoryName: ruleForm.categoryName
      }
      instance
        .post('/blog_category/add', data)
        .then(res => {
          const { status, message } = res.data
          const type = status === 200 ? 'success' : 'error'
          if (res?.status === 200) {
            console.log(res)
            // eslint-disable-next-line no-undef
            ElNotification({
              title: '新增博客分类',
              message: message,
              type
            })
          }
        })
        .catch(err => {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: '新增博客分类',
            message: err,
            type: 'error'
          })
          throw new Error(err)
        })
    } else {
      console.log('error submit!')
    }
  })
}

const resetForm = formEl => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped></style>
