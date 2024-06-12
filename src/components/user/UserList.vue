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

  <div class="pagenation-default">
    <el-pagination
        v-model:current-page="currentPage1"
        v-model:page-size="pageSize10"
        :page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />

  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import instance from '@/axios/base';

const userData = ref()
const totalCount = ref(1)

//分页参数
const currentPage = ref(1)
const pagesize = ref(10)

/* onMounted(() => {
  getUserList()
})  */
function getUserList () {
  instance.get(`/user/userlist?pageSize=${pagesize.value}&currentPage=${currentPage.value}`)
  .then(res => {
    // console.log('res, ', res)
    userData.value = res.data.pageData
    console.log('totalCount: ', res.data.totalCount)
    totalCount.value = Number(res.data.totalCount)
  }).catch(error => {
    console.error(error)
  })
}
getUserList()

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

// 分页
const currentPage1 = ref(1)
const pageSize10 = ref(10)
const small = ref(false)
const background = ref(true)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserList()
  console.log(`current page: ${val}`)
}
</script>
