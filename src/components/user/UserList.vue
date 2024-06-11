<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="用户名" prop="username" />
    <el-table-column label="昵称" prop="nickname" />
    <el-table-column label="邮箱" prop="email" />
    <el-table-column label="年龄" prop="age" />
    <el-table-column label="性别" prop="sex" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="输入搜索条件" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import instance from '@/axios/base';

const userData = ref()

/* onMounted(() => {
}) */

instance.get('/user/userlist')
.then(res => {
  console.log('res, ', res)
  userData.value = res.data.data
})
const search = ref('')
const filterTableData = computed(() =>
userData?.value?.filter(
    (data) =>
      !search.value ||
      data.username.toLowerCase().includes(search.value.toLowerCase())
  )
)
const handleEdit = (index, row) => {
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}
</script>
