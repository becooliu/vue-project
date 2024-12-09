<template>

    <div class="blog-details-wrap">
        <BlogHead :likesData="likesData" />
        <div class="loading" v-if="loading">
            loading...
        </div>
        <article>
            <h2 class="blog-title">{{ blogDetailsData?.title }}</h2>
            <p class="blog-sub-title">{{ blogDetailsData?.desc }}</p>
            <div class="blog-views-author">
                <div class="left">
                    <span class="view">
                        <el-icon>
                            <View />
                        </el-icon>
                        {{ viewCount }}人已阅读
                    </span>
                    <span class="author">
                        <el-icon>
                            <User />
                        </el-icon>
                        作者：{{ blogDetailsData?.user?.nickname || blogDetailsData?.user.username }}
                    </span>

                </div>
                <div class="right">
                    <span class="update-at">
                        最近更新时间：{{ dateToLocaleString(blogDetailsData?.updatedAt) }}
                    </span>
                </div>
            </div>
            <ElDivider />
        </article>
        <!--博客正文，使用vmd editor 的预览模式-->
        <v-md-editor :model-value="blogDetailsData?.content" mode="preview"></v-md-editor>
    </div>

    <!--返回顶部-->
    <el-backtop :bottom="100">
        <div style="
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #369;
        box-shadow: #aaa;
        text-align: center;
        line-height: 40px;
        color: #1989fa;
      ">
            <el-icon>
                <Top style="color: #fff;" />
            </el-icon>
        </div>
    </el-backtop>
</template>
<script setup>
import { View, User, Top } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '@/axios/base'
import { onMounted } from 'vue'

import BlogHead from './BlogHead.vue'

import { dateToLocaleString } from '@/utils/index'

const store = useBlogViewsStore()

const route = useRoute()

const blogDetailsData = ref(null)
const loading = ref(false)
const error = ref(null)

const likesData = ref([])


const viewCount = ref(0)
const curBlogId = ref('')



watch(() => route.params._id, getBlogData, { immediate: true })

async function getBlogData(_id) {
    error.value = blogDetailsData.value = null
    loading.value = true
    try {
        const blogData = await instance.get(`/blog/details/`, { params: { _id } })
        blogDetailsData.value = blogData.data
        const categoryId = blogData.data.category._id
        viewCount.value = blogData.data.views
        const blogLikes = await instance.get('/blog/likes', { params: { category: categoryId, blogId: _id } })
        likesData.value = blogLikes.data
    } catch (err) {
        error.value = err.toString()
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    curBlogId.value = location.pathname.split('blog/details/').pop()
    await getBlogData(curBlogId.value)
    let _views = viewCount.value + 1
    const viewsData = {
        _id: curBlogId.value,
        views: _views
    }
    const updataViews = await instance.post('/blog/views_increase', viewsData)
    if (updataViews.data.status == 200) {
        console.log(updataViews.data.message)
    }

})


/* onBeforeRouteUpdate(async (to, from) => {
    const blogId = to.params._id
    console.log('blogId', blogId)
    const blogData = await instance.get(`/blog/details/`, { _id: blogId })
    console.log(blogData)
}) */
</script>

<style lang="scss">
.blog-details-wrap {
    width: 80%;
    padding: 2rem;
    margin: 0 auto;

    .blog-views-author {
        color: #999;

        span {
            margin-right: 1.5rem;
        }
    }
}

article {
    padding: 2rem 2.5rem;

    .blog-views-author {
        display: flex;
        justify-content: space-between;
    }
    .blog-title,
    .blog-sub-title {
        text-align: center;
    }

    .blog-title {
        margin-bottom: 1.3rem;
    }

    .blog-sub-title {
        margin-bottom: 1.1rem;
    }

    .content {
        line-height: 1.9rem;
        text-indent: 2rem;
    }
}
</style>
