<template>
  <div class="search-wrap">
    <el-input v-model="search" placeholder="输入搜索关键字">
      <template #append>查找</template>
    </el-input>
  </div>

  <div class="blog-wrap">
    <div class="blog-item" v-for="item in filterTableData" :key="item._id">
      <a class="flex-item" :href="`/blog/details/` + item._id">
        <el-image :src="item?.src || defaultImgSrc" style="width: 15%;">
          <template #error>
            <div class="image-slot">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
        <div class="blog-content-wrap">
          <h4 class="blog-title">{{ item.title }}</h4>
          <p class="sub-title">{{ item.desc }}</p>
          <span class="author">作者：{{ item.user.username }}</span>
          <span class="created-at">发布时间：{{ CreatedAt(item.createdAt) }}</span>
          <div class="footer">
            <span class="view">
              <el-icon>
                <View />
              </el-icon>
              {{ item.views }}人已阅读
            </span>
            <span class="comment">
              <el-icon>
                <Comment />
              </el-icon>
              {{ item.comments.length }} 条评论
            </span>
          </div>
        </div>

      </a>

    </div>

  </div>

  <!-- 显示分页 -->
  <div class="pagenation-default">
    <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize10"
      :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :small="small" :disabled="disabled" :background="background"
      layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" @update:page-size="updatePageSize" />
  </div>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from 'vue'
import instance from '@/axios/base';
import { View, Comment, Picture } from '@element-plus/icons-vue'

const defaultImgSrc = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'

const blogData = ref()
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
  // getUserList()
}
const updatePageSize = (val: number) => {
  pagesize.value = val
  // getUserList()
}

/* onMounted(() => {
  getUserList()
})  */
function getBlogList() {
  instance.get(`/blog/list?pageSize=${pagesize.value}&currentPage=${currentPage.value}`)
    .then(res => {
      blogData.value = res.data.pageData
      console.log('totalCount: ', totalCount)
      totalCount.value = res.data.totalCount
    }).catch(error => {
      console.error(error)
    })
}
getBlogList()

const search = ref('')
const filterTableData = computed(() =>
  blogData?.value?.filter(
    (data) =>
      !search.value ||
      (data.title || data.desc || data.keywords).toLowerCase().includes(search.value.toLowerCase())
  )
)

const CreatedAt = ((str) => {
  return new Date(str).toLocaleString()
})
</script>
<style scoped>
.search-wrap {
  padding: 2em 1em 3em;
}

.flex-item {
  display: flex;
  align-items: top;
}

.blog-item {
  border: 1px solid #ddd;
  padding: 4px;
  margin: 4px;
  border-radius: 0 0 3px;

  &:hover {
    box-shadow: 0 0 4px #999;
  }

  .flex-item {
    text-decoration: none;
    color: #333;
  }

  .blog-content-wrap {
    position: relative;
    padding: 1em;
    flex-grow: 1;

    .blog-title {
      margin-top: 0;
    }

    .author,
    .created-at {
      font-size: 14px;
      color: #666;
      margin-right: 2em;
    }

    .footer {
      position: absolute;

      bottom: 0;

      >* {
        margin-right: 2em;
        font-size: 14px;
        color: #666;
      }
    }
  }
}
</style>
