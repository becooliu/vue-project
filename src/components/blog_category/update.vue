<template>
  <el-table :data="filterTableData" style="width: 100%">
    <el-table-column label="序号" type="index" width="70px" />
    <el-table-column label="_id" prop="_id" />
    <el-table-column label="分类名" prop="name" />

    <el-table-column align="right">
      <template #header>
        <el-input v-model="search" size="small" placeholder="输入搜索条件" />
      </template>
      <template #default="scope">
        <el-button size="small" type="primary" @click="handleEditDialogForm(scope.$index, scope.row)">
          编辑
        </el-button>

        <el-popconfirm title="确认删除此分类？" width="220" confirm-button-text="是" cancel-button-text="取消"
          @confirm="deleteCategory(scope.$index, scope.row)">
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

  <!-- 编辑分类 -->
  <el-dialog v-model="editDialogFormVisible" title="编辑分类信息" width="500">
    <el-form :model="form">
      <el-form-item label="_id" :label-width="formLabelWidth">
        <el-input v-model="form._id" autocomplete="off" disabled />
      </el-form-item>
      <el-form-item label="分类名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
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

const categoryData = ref()
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
  getCategoryList()
}
const updatePageSize = (val: number) => {
  pagesize.value = val
  getCategoryList()
}

function getCategoryList() {
  instance.get(`/blog_category/get?pageSize=${pagesize.value}&currentPage=${currentPage.value}`)
    .then(res => {
      console.log('Update: ', res.data)
      categoryData.value = res.data.categories
      console.log('totalCount: ', totalCount)
      totalCount.value = res.data.totalCount
    }).catch(error => {
      console.error(error)
    })
}
getCategoryList()

const search = ref('')
const filterTableData = computed(() =>
  categoryData?.value?.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

// 编辑分类参数
const editDialogFormVisible = ref(false)
const formLabelWidth = '140px'
let form = reactive({
  _id: '',
  name: ''
})

// 保存修改数据前，将当前正在修改的数据进行保存，以便点击保存按钮时，比对数据是否有修改
let rowDataBeforeEdit = {
  _id: '',
  name: ''
}
const handleEditDialogForm = (index, row) => {
  editDialogFormVisible.value = true
  form = row
  // 对修改前响应式数据进行解构，使其失去响应式功能
  const { _id, name } = form
  rowDataBeforeEdit = {
    _id,
    name
  }
  // console.log(index, row)
}


// 保存分类信息

const confirmEditUserInfo = function () {
  console.log('form: ', form)
  //判断数据是否有被修改，如果没有修改，不做处理
  if (form.name == rowDataBeforeEdit.name) {
    console.log('rowDataBeforeEdit: ', rowDataBeforeEdit)
    ElNotification({
      title: "保存数据",
      message: "没有数据被修改，无需保存。",
      type: "warning"
    });
    return
  }

  // 保存修改的分类数据
  const { _id, name } = form
  const categoryData = {
    _id,
    name
  }
  instance.post('/blog_category/update', categoryData).then(res => {
    const { status, message } = res.data
    console.log('status', status)
    const type = status === 200 ? "success" : "error";
    if (status === 200) {
      // eslint-disable-next-line no-undef
      ElNotification({
        title: "修改分类信息",
        message: message,
        type,
      });
    }
  })
    .catch((err) => {
      // eslint-disable-next-line no-undef
      ElNotification({
        title: "修改分类信息",
        message: err,
        type: "error",
      });
    });
}

// 删除分类
const deleteCategory = (index, row) => {
  console.log(index, row)
  const { _id, name } = row
  const deleteCategory = {
    _id,
    name,
    currentPage: currentPage.value,
    pagesize: pagesize.value
  }

  instance.post('/blog_category/delete', deleteCategory).then(res => {
    const { status, message, categories } = res.data
    const type = status === 200 ? 'success' : 'error'
    if (status === 200) {
      categoryData.value = categories
      totalCount.value = Number(res.data.totalCount)
      ElNotification({
        title: "删除分类",
        message: message,
        type,
      });
    } else {
      ElNotification({
        title: "删除分类",
        message: message,
        type: "error"
      });
    }
  })
    .catch(err => {
      ElNotification({
        title: "删除分类",
        message: err,
        type: "error",
      });
    })
}
</script>
