<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="序号" type="index" width="70px"/>
    <el-table-column label="用户名" prop="username" />
    <el-table-column label="昵称" prop="nickname" />
    <el-table-column label="邮箱" prop="email"/>
    <el-table-column label="年龄">
      <template #default="scopeRowBrithday">
        <span>{{ computedUserAge(scopeRowBrithday.row.birthday) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="性别">
      <template #default="scopeRowSex">
        <span>{{ computedUserSex(scopeRowSex.row.sex) }}</span>
      </template>
    </el-table-column>
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
        @update:page-size="updatePageSize"
        />
  </div>

  <!-- 编辑用户 -->
  <el-dialog v-model="editDialogFormVisible" title="编辑用户信息" width="500">
    <el-form :model="form">
      <el-form-item label="帐号" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="昵称" :label-width="formLabelWidth">
        <el-input v-model="form.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="出生日期" :label-width="formLabelWidth">
        <el-date-picker
        v-model="form.birthday"
        type="date"
        :disabled-date="disabledDate" 
        placeholder="Pick a day"
      />
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth">
        <el-select v-model="form.sex" placeholder="请选择">
          <el-option label="男性" value="male" />
          <el-option label="女性" value="female" />
          <el-option label="保密" value="unknown" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取消</el-button>
        
        <el-button type="primary" @click="confirmEditUserInfo">
        确认
      </el-button>
      </div>

    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from 'vue'
import instance from '@/axios/base';

const userData = ref()
const totalCount = ref(1)

//分页参数
const currentPage = ref(1)
const pagesize = ref(10)

// 分页
const currentPage1 = ref(1)
const pageSize10 = ref(10)
const small = ref(false)
const background = ref(true)
const disabled = ref(false)

const handleSizeChange = (val: number) => {
  pagesize.value = val
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUserList()
  console.log(`current page: ${val}`)
}
const updatePageSize = (val: number) => {
  console.log(`pageSize update ${val}`)
  pagesize.value = val
  getUserList()
}

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

const computedUserAge = (birthday: string) =>{
  return Math.floor(Math.abs(new Date().getTime() - new Date(birthday).getTime()) / (1000 * 60 * 60 * 24 * 30 * 12))
}
const computedUserSex = (sex: string) =>{
  return (sex === 'male' ? '男' : (sex === 'female' ? '女' : '保密'))
}

// 编辑用户参数
const editDialogFormVisible = ref(false)
const formLabelWidth = '140px'
let form = reactive({
  username: '',
  nickname: '',
  birthday: '',
  sex: ''
})

// 保存修改数据前，将当前正在修改的数据进行保存，以便点击保存按钮时，比对数据是否有修改
let rowDataBeforeEdit = {
  username: '',
  nickname: '',
  birthday: '',
  sex: ''
}
const handleEditDialogForm = (index, row) => {
  editDialogFormVisible.value = true
  form = row
  // 对修改前响应式数据进行解构，使其失去响应式功能
  const {username, nickname, birthday, sex} = form
  rowDataBeforeEdit = {
    username,
    nickname,
    birthday,
    sex
  }
  // console.log(index, row)
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

// 保存用户信息

const confirmEditUserInfo = function(){
  console.log('form: ', form)
  //判断数据是否有被修改，如果没有修改，不做处理
  if (form.username == rowDataBeforeEdit.username && form.sex == rowDataBeforeEdit.sex && form.nickname == rowDataBeforeEdit.nickname && form.birthday == rowDataBeforeEdit.birthday) {
    console.log('rowDataBeforeEdit: ', rowDataBeforeEdit)
    ElNotification({
      title: "保存数据",
      message: "没有数据被修改，无需保存。",
      type: "warning"
    });
    return
  }

  // 保存修改的用户数据
  const {username, nickname, sex, birthday} = form
  const userData = {
    username,
    nickname,
    birthday,
    sex
  }
  instance.post('/user/update_userinfo', userData).then(res => {
    const {status, message} = res.data
    console.log('status', status)
    const type = status === 200 ? "success" : "error";
    if (status === 200) {
      console.log('456', res);
      // eslint-disable-next-line no-undef
      ElNotification({
        title: "修改用户信息",
        message: message,
        type,
      });
    }
  })
  .catch((err) => {
    // eslint-disable-next-line no-undef
    ElNotification({
      title: "修改用户信息",
      message: err,
      type: "error",
    });
  });
}
const handleDelete = (index, row) => {
  console.log(index, row)
}
</script>
