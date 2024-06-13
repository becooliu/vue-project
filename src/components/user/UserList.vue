<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="序号" type="index" width="70px"/>
    <el-table-column label="用户名" prop="username" />
    <el-table-column label="昵称" prop="nickname" />
    <el-table-column label="邮箱" prop="email" />
    <el-table-column label="出生日期" prop="birthday" />
    <el-table-column label="性别" prop="sex" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="输入搜索条件" />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEditDialogForm(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 显示分页 -->
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

  <!-- 编辑用户 -->
  <el-dialog v-model="editDialogFormVisible" title="编辑用户信息" width="500">
    <el-form :model="form">
      <el-form-item label="帐号" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="form.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option label="男性" value="male" />
          <el-option label="女性" value="female" />
          <el-option label="保密" value="unknow" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editDialogFormVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from 'vue'
import instance from '@/axios/base';
import { ro } from 'element-plus/es/locale';

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


// 编辑用户参数
const editDialogFormVisible = ref(false)
const formLabelWidth = '140px'
let form = reactive({
  username: '',
  nickname: '',
  email: '',
  birthday: '',
  sex: ''
})
const handleEditDialogForm = (index, row) => {
  editDialogFormVisible.value = !editDialogFormVisible.value
  form = row
  console.log(index, row)
}
const handleDelete = (index, row) => {
  console.log(index, row)
}
</script>
