<template>
    <div class="blog-details-wrap">
        <div class="loading" v-if="loading">
            loading...
        </div>
        <article>
            <h2 class="blog-title">{{ blogDetailsData.title }}</h2>
            <p class="blog-sub-title">{{ blogDetailsData.desc }}</p>
            <div class="blog-views-author">
                <span class="view">
                    <el-icon>
                        <View />
                    </el-icon>
                    {{ blogDetailsData.views }}人已阅读
                </span>
                <span class="author">
                    <el-icon>
                        <User />
                    </el-icon>
                    作者：{{ blogDetailsData.user.username }}
                </span>
            </div>
            <ElDivider />
            <p class="content">{{ blogDetailsData.content }}</p>
        </article>
    </div>
</template>
<script setup>
import { View, User } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '@/axios/base'

const route = useRoute()

const blogDetailsData = ref(null)
const loading = ref(false)
const error = ref(null)

watch(() => route.params._id, getBlogData, { immediate: true })

async function getBlogData(_id) {
    error.value = blogDetailsData.value = null
    loading.value = true
    console.log('_id', _id)
    try {
        const blogData = await instance.get(`/blog/details/`, { params: { _id } })
        console.log('blogData', blogData)
        blogDetailsData.value = blogData.data.pageData
    } catch (err) {
        error.value = err.toString()
    } finally {
        loading.value = false
    }
}

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

        >span {
            margin-right: 1.5rem;
        }
    }
}

article {

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
