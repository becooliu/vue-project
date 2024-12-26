<template>
  <div class="blog-lists-wrap">
    <div class="search-wrap">
      <el-input v-model="search" placeholder="输入搜索关键字">
        <template #append>查找</template>
      </el-input>
    </div>

    <div class="blog-wrap">
      <el-card v-for="item in filterTableData" :key="item._id" shadow="hover" class="blog-item"
        @click.prevent="goToBlogDetail(item._id)">
        <el-row>
          <el-col :span="3">
            <el-image class="blog-cover" :src="item?.cover">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </el-col>
          <el-col :span="21">
            <div class="content-wrap">
              <h5 class="blog-title">{{ item.title }}</h5>
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
          </el-col>
        </el-row>
      </el-card>

    </div>

    <!-- 显示分页 -->
    <div class="pagenation-default">
      <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize10"
        :page-sizes="[10, 20, 50, 100, 200, 500, 1000]" :small="small" :disabled="disabled" :background="background"
        layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" @update:page-size="updatePageSize" />
    </div>

  </div>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, onMounted } from 'vue'
import instance from '@/axios/base';
import { View, Comment, Picture } from '@element-plus/icons-vue'
import router from '@/router';

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

const goToBlogDetail = (_id) => {
  console.log(_id)
  router.push(`/blog/details/${_id}`)
}
</script>
<style lang="scss" scoped>
.blog-lists-wrap {
  width: 80%;
  padding: 2rem;
  margin: 0 auto;
}

.search-wrap {
  padding: 2em 1em 3em;
}

.blog-item {
  padding: 4px;
  margin: 4px 4px 1rem;
  cursor: pointer;

  .blog-cover {
    min-height: 130px;
    text-align: center;
    display: block;
  }

  .content-wrap {
    position: relative;
    padding: 0 1.5rem;
    height: 100%;

    .blog-title,
    .sub-title {
      margin-top: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }

    .blog-title {
      font-size: 1.2rem;
    }

    .sub-title {
      font-size: 1rem;
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
