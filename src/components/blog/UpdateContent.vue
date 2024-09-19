<template>
  <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto" class="blog-ruleForm">
    <h3 class="user_form_title">更新博客</h3>

    <el-form-item label="标题" prop="title" required>
      <el-input v-model="ruleForm.title" type="text" autocomplete="off" />
    </el-form-item>
    <el-form-item label="副标题" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" autocomplete="off" :rows="2" />
    </el-form-item>
    <el-form-item label="关键字" prop="keywords">
      <el-input v-model="ruleForm.keywords" type="text" autocomplete="off" placeholder="关键字使用逗号,隔开" />
    </el-form-item>
    <el-form-item label="封面图" pop="cover">
      <el-input v-model="ruleForm.cover" type="upload" autocomplete="off" placeholder="请输入图片链接" />
      <div class="block-image">
        <el-image :src="ruleForm.cover" />
      </div>
    </el-form-item>
    <!-- <el-form-item label="封面图" prop="cover">
      <el-input v-model="ruleForm.cover" type="text" autocomplete="off" placeholder="请输入图片链接" />
    </el-form-item> -->
    <el-form-item label="正文" prop="content" required>
      <v-md-editor v-model="ruleForm.content" height="400px"></v-md-editor>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确认更新
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import instance from '@/axios/base.js'
import { getCookie } from '@/utils/tools.js'

import { useCurrentEditBlogStore } from '@/store';

const store = useCurrentEditBlogStore()

// import { ElNotification } from "element-plus";
// import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref(null)
const categoryArr = ref([])
const currentUserId = ref('') //当前登录用户的 _id

// 获取当前需要修改的 blog _id
/* const currentBlogId = ref('')
currentBlogId.value = store.getBlogId
console.log('currentBlogId', currentBlogId.value) */

let ruleForm = reactive({
  title: '',
  desc: '',
  cover: '',
  keywords: '',
  content: ''
})

function getBlog() {
  const currentBlogId = store.getBlogId
  instance.get('/blog/get_by_id', { params: { _id: currentBlogId } }).then(result => {
    console.log('result.data', result.data)
    ruleForm.title = result.data.title
    ruleForm.desc = result.data.desc
    ruleForm.cover = result.data.cover
    ruleForm.keywords = result.data.keywords
    ruleForm.content = result.data.content
  })
}

getBlog()

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
        _id: store.getBlogId,
        title: ruleForm.title,
        desc: ruleForm.desc,
        keywords: ruleForm.keywords,
        cover: ruleForm.cover,
        content: ruleForm.content,
        user: currentUserId.value
      }
      instance
        .post('/blog/update_bloginfo', data)
        .then(res => {
          const { status, message } = res.data
          const type = status === 200 ? 'success' : 'error'
          if (res?.status === 200) {
            // eslint-disable-next-line no-undef
            ElNotification({
              title: '更新博客',
              message: message,
              type
            })
          }
        })
        .catch(err => {
          // eslint-disable-next-line no-undef
          ElNotification({
            title: '更新博客',
            message: err,
            type: 'error'
          })
          throw new Error(err)
        })
    } else {
      // eslint-disable-next-line no-undef
      ElNotification({
        title: '更新博客',
        message: '请检查填写的字段。',
        type: 'error'
      })
      console.log('error submit!')
    }
  })
}

const resetForm = formEl => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style scoped>
.block-image {
  padding: 1.5rem 0;
  width: 85%;
}
</style>
