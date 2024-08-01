<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="blog-ruleForm">
    <h3 class="user_form_title">发布博客</h3>
    <el-form-item label="分类" prop="category">
      <el-select v-model="ruleForm.category" placeholder="选择分类" style="width: 100%">
        <el-option v-for="item in categoryArr" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
    </el-form-item>

    <el-form-item label="标题" prop="title" required>
      <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item label="副标题" prop="desc">
      <el-input v-model="ruleForm.desc" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item label="关键字" prop="keywords">
      <el-input v-model="ruleForm.keywords" type="text" autocomplete="off" placeholder="关键字使用逗号,隔开" />
    </el-form-item>
    <el-form-item label="正文" prop="content" required>
      <v-md-editor v-model="ruleForm.content" height="400px"></v-md-editor>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        发布博客
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import instance from '@/axios/base.js'
import {getCookie} from '@/utils/tools.js'

// import { ElNotification } from "element-plus";
// import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref(null)
const categoryArr = ref([])
const currentUserId = ref('') //当前登录用户的 _id

const ruleForm = reactive({
  category: '',
  title: '',
  desc: '',
  keywords: '',
  content: ''
})

// 获取分类信息
function getCategory() {
  instance.get('/blog_category/get').then(result => {
    categoryArr.value = result.data.categories
  })
}
getCategory()

// 获取当前登录的用户
currentUserId.value = JSON.parse(getCookie('userInfo'))._id || ''


const validateTitle = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('标题不能为空。'))
  }
  callback()
}

const validateContent = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('内容不能为空'))
  }
  callback()
}

const rules = reactive({
  title: [{ validator: validateTitle, trigger: 'blur' }],
  content: [{ validator: validateContent, trigger: 'blur' }]
})

const submitForm = formEl => {
  if (!formEl) return
  formEl.validate(valid => {
    if (valid) {
      const data = {
        category: ruleForm.category,
        title: ruleForm.title,
        desc: ruleForm.desc,
        keywords: ruleForm.keywords,
        content: ruleForm.content,
        user: currentUserId.value
      }
      instance
        .post('/blog/add', data)
        .then(res => {
          const { status, message } = res.data
          const type = status === 200 ? 'success' : 'error'
          if (res?.status === 200) {
            console.log(res)
            // eslint-disable-next-line no-undef
            ElNotification({
              title: '发布博客',
              message: message,
              type
            })
          }
        })
        .catch(err => {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: '发布博客',
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
