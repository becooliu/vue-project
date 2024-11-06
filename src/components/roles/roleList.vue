<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="序号" type="index" width="70px" />
    <el-table-column label="角色名" prop="role" />
    <el-table-column label="权限" prop="permissions" />
    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="输入搜索条件" />
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" @click="handleEditDialogForm(scope.$index, scope.row)">
          编辑
        </el-button>

        <el-popconfirm title="确认删除此用户？" width="220" confirm-button-text="是" cancel-button-text="取消"
          @confirm="deleteUser(scope.$index, scope.row)">
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <!-- 显示分页 -->
  <div class="pagenation-default">
    <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize10"
      :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :small="small" :disabled="disabled" :background="background"
      layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @update:page-size="updatePageSize" />
  </div>

  <!-- 编辑角色 -->
  <el-dialog v-model="editDialogFormVisible" title="编辑角色信息" width="500">
    <el-form :model="form">
      <el-form-item label="角色" :label-width="formLabelWidth">
        <el-input v-model="form.role" autocomplete="off" />
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

const roleData = ref()
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
  getRoleList()
}
const updatePageSize = (val: number) => {
  pagesize.value = val
  getRoleList()
}

function getRoleList() {
  instance.get(`/roles/getAll?pageSize=${pagesize.value}&currentPage=${currentPage.value}`)
    .then(res => {
      roleData.value = res.data.pageData
      console.log('totalCount: ', totalCount)
      totalCount.value = res.data.totalCount
    }).catch(error => {
      console.error(error)
    })
}
getRoleList()

const search = ref('')
const filterTableData = computed(() =>
  roleData?.value?.filter(
    (data) =>
      !search.value ||
      data.role.toLowerCase().includes(search.value.toLowerCase())
  )
)

// 编辑用户参数
const editDialogFormVisible = ref(false)
const formLabelWidth = '140px'
let form = reactive({
  role: '',
  _id: ''
})

// 保存修改数据前，将当前正在修改的数据进行保存，以便点击保存按钮时，比对数据是否有修改
let rowDataBeforeEdit = {
  role: '',
  _id: ''
}
const handleEditDialogForm = (index, row) => {
  editDialogFormVisible.value = true
  form = row
  // 对修改前响应式数据进行解构，使其失去响应式功能
  const { role, _id } = form
  rowDataBeforeEdit = {
    role,
    _id
  }
  // console.log(index, row)
}

// 保存用户信息

const confirmEditUserInfo = function () {
  console.log('form: ', form)
  //判断数据是否有被修改，如果没有修改，不做处理
  if (form.role == rowDataBeforeEdit.role) {
    console.log('rowDataBeforeEdit: ', rowDataBeforeEdit)
    ElNotification({
      title: "保存数据",
      message: "没有数据被修改，无需保存。",
      type: "warning"
    });
    return
  }

  // 保存修改的用户数据
  const { role, _id } = form
  const roleData = {
    role,
    _id
  }
  instance.post('/user/update_role', roleData).then(res => {
    const { status, message } = res.data
    console.log('status', status)
    const type = status === 200 ? "success" : "error";
    if (status === 200) {
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
const deleteUser = (index, row) => {
  console.log(index, row)
  const { username, _id } = row
  const deleteUser = {
    _id,
    username,
    currentPage: currentPage.value,
    pagesize: pagesize.value
  }

  instance.post('/user/delete_user', deleteUser).then(res => {
    const { status, message, pageData } = res.data
    const type = status === 200 ? 'success' : 'error'
    if (status === 200) {
      roleData.value = pageData
      totalCount.value = Number(res.data.totalCount)
      ElNotification({
        title: "删除用户",
        message: message,
        type,
      });
    } else {
      ElNotification({
        title: "删除用户",
        message: message,
        type: "error"
      });
    }
  })
    .catch(err => {
      ElNotification({
        title: "删除用户",
        message: err,
        type: "error",
      });
    })
}
</script>
