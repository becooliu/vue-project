<template>
    <el-table :data="filterTableData" style="width: 100%">
        <el-table-column label="序号" type="index" width="70px" />
        <el-table-column label="作者" prop="user.username" />
        <el-table-column label="标题" prop="title" show-overflow-tooltip />
        <el-table-column label="副标题" prop="desc" show-overflow-tooltip />
        <el-table-column label="封面图" prop="cover">
            <template #default="scopeRowCover">
                <el-image style="width: 30px; height: 30px" :src="scopeRowCover.row.cover" fit="cover">
                    <template #error>
                        <div class="image-slot-error">
                            <el-icon>
                                <Picture />
                            </el-icon>
                        </div>
                    </template>
                </el-image>
            </template>
            <template #error>
                <div class="image-slot">
                    <el-icon>
                        <Picture />
                    </el-icon>
                </div>
            </template>

        </el-table-column>
        <el-table-column label="所属分类" prop="category.name" />
        <el-table-column label="最后更新时间" show-overflow-tooltip>
            <template #default="scopeRowUpdateAt">
                <span>{{ computedDate(scopeRowUpdateAt.row.updatedAt) }}</span>
            </template>
        </el-table-column>

        <el-table-column align="right">
            <template #header>
                <el-input v-model="search" size="small" placeholder="输入搜索条件" />
            </template>
            <template #default="scope">
                <el-button size="small" type="primary" @click="handleEditDialogForm(scope.$index, scope.row)">
                    编辑
                </el-button>

                <el-popconfirm title="确认删除此博客？" width="220" confirm-button-text="是" cancel-button-text="取消"
                    @confirm="deleteRow(scope.$index, scope.row)">
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

    <!-- 编辑博客 -->
    <el-dialog v-model="editDialogFormVisible" title="编辑博客" width="600">
        <el-form :model="form">
            <el-form-item label="作者" :label-width="formLabelWidth">
                <el-input v-model="form.user.username" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="标题" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="副标题" :label-width="formLabelWidth">
                <el-input v-model="form.desc" type="textarea" autocomplete="off" :rows="2" />
            </el-form-item>
            <el-form-item label="封面图" :label-width="formLabelWidth">
                <el-input v-model="form.cover" type="upload" autocomplete="off" placeholder="请输入图片链接" />
                <div class="block-image">
                    <el-image :src="form.cover" />
                </div>
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editDialogFormVisible = false">取消</el-button>

                <el-button type="primary" @click="confirmEditBlogInfo">
                    确认
                </el-button>
            </div>

        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import router from '@/router'
import { computed, ref, reactive, onMounted } from 'vue'
import instance from '@/axios/base'
import { dateToLocaleString } from '@/utils';
import { Picture } from '@element-plus/icons-vue'

import { useCurrentEditBlogStore } from '@/store';
const store = useCurrentEditBlogStore()

const listData = ref()
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
    getBlogList()
}
const updatePageSize = (val: number) => {
    pagesize.value = val
    getBlogList()
}

function getBlogList() {
    const userId = localStorage.getItem('userId')
    instance
        .get(`/blog/list?pageSize=${pagesize.value}&currentPage=${currentPage.value}&userId=${userId}`)
        .then(res => {
            listData.value = res.data.pageData
            // console.log('listData.value.category: ', listData.value)
            totalCount.value = res.data.totalCount
        })
        .catch(error => {
            console.error(error)
        })
}
getBlogList()

const search = ref('')
const filterTableData = computed(() =>
    listData?.value?.filter(data => !search.value || data.title.toLowerCase().includes(search.value.toLowerCase()) || data.desc.toLowerCase().includes(search.value.toLowerCase()) || data.user.username.toLowerCase().includes(search.value.toLowerCase()))
)

const computedDate = (updateAt: String) => {
    return dateToLocaleString(updateAt)
}

// 编辑博客参数
const editDialogFormVisible = ref(false)
const formLabelWidth = '140px'
let form = reactive({
    _id: '',
    user: null,
    title: '',
    desc: '',
    cover: ''
})

// 保存修改数据前，将当前正在修改的数据进行保存，以便点击保存按钮时，比对数据是否有修改
let rowDataBeforeEdit = {
    title: '',
    desc: '',
    cover: ''
}
const handleEditDialogForm = (index, row) => {
    // console.log('row._id:', row._id)
    store.setBlogId(row._id)
    router.push({ name: 'blog_updateContent' })
    /* editDialogFormVisible.value = true
    form = row
    console.log('edit row: ', row)
    // 对修改前响应式数据进行解构，使其失去响应式功能
    const { title, desc, cover } = form
    rowDataBeforeEdit = {
        title,
        desc,
        cover
    } */
    // console.log(index, row)
}

// 保存博客信息
const confirmEditBlogInfo = function () {
    console.log('form: ', form)
    //判断数据是否有被修改，如果没有修改，不做处理
    if (
        form.title == rowDataBeforeEdit.title &&
        form.desc == rowDataBeforeEdit.desc &&
        form.cover == rowDataBeforeEdit.cover
    ) {
        console.log('rowDataBeforeEdit: ', rowDataBeforeEdit)
        ElNotification({
            title: '保存数据',
            message: '没有数据被修改，无需保存。',
            type: 'warning'
        })
        return
    }

    // 保存修改的博客数据
    const { _id, title, desc, cover } = form
    const listData = {
        _id,
        title,
        cover,
        desc
    }
    instance
        .post('/blog/update_bloginfo', listData)
        .then(res => {
            const { status, message } = res.data
            console.log('status', status)
            const type = status === 200 ? 'success' : 'error'
            if (status === 200) {
                // eslint-disable-next-line no-undef
                ElNotification({
                    title: '修改博客信息',
                    message: message,
                    type
                })
            }
        })
        .catch(err => {
            // eslint-disable-next-line no-undef
            ElNotification({
                title: '修改博客信息',
                message: err,
                type: 'error'
            })
        })
}

/**
 * 删除博客
 * @param index 
 * @param row 
 */
const deleteRow = (index, row) => {
    console.log(index, row)
    const { _id } = row
    const deleteBlog = {
        _id,
        currentPage: currentPage.value,
        pagesize: pagesize.value
    }

    instance
        .post('/blog/delete_blog', deleteBlog)
        .then(res => {
            const { status, message, pageData } = res.data
            const type = status === 200 ? 'success' : 'error'
            if (status === 200) {
                listData.value = pageData
                totalCount.value = Number(res.data.totalCount)
                ElNotification({
                    title: '删除博客',
                    message: message,
                    type
                })
            } else {
                ElNotification({
                    title: '删除博客',
                    message: message,
                    type: 'error'
                })
            }
        })
        .catch(err => {
            ElNotification({
                title: '删除用户',
                message: err,
                type: 'error'
            })
        })
}
</script>

<style scoped>
.image-slot-error {
    height: 100%;
    text-align: center;
    font-size: 30px;
}

.block-image {
    padding: 1.5rem 0;
    width: 85%;
}
</style>
