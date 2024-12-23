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
        <ElDivider />
        <div class="comments-wrapper">
            <h4 class="title">评论</h4>
            <p class="no-comments" v-if="!comments.length">暂无评论</p>
            <!--发表评论-->
            <el-form ref="ruleFormRef" v-if="comments.length || !showCommentForm" :model="ruleForm" status-icon
                :rules="rules" label-width="auto">
                <el-form-item prop="comment">
                    <el-input v-model="ruleForm.comment" type="textarea" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)"
                        @keyup.enter="submitForm(ruleFormRef)">发表评论</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
            <!--评论列表-->
            <ul class="comments-list" v-if="comments.length">
                <li class="comment-item" v-for="item in comments" :key="item.randomId">
                    <div class="avatar-container">
                        <div class="avatar">{{ item.username.slice(0, 1).toUpperCase() }}</div>
                        <div class="info">
                            <div class="username">{{ item.username }}</div>
                            <span class="comment-time">{{ timeStringToDate(item.randomId) }}</span>
                            <p class="comment">{{ item.comment }}</p>
                        </div>

                    </div>
                </li>
            </ul>
        </div>
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
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '@/axios/base'
import { onMounted } from 'vue'

import { timeStringToDate } from '@/utils/index'

import BlogHead from './BlogHead.vue'

import { dateToLocaleString } from '@/utils/index'

const route = useRoute()

const blogDetailsData = ref(null)
const loading = ref(false)
const error = ref(null)

const likesData = ref([])

const viewCount = ref(0)
const curBlogId = ref('')

const comments = ref([])
const ruleFormRef = ref(null)
const showCommentForm = ref(true)

watch(() => route.params._id, getBlogData, { immediate: true })

async function getBlogData(_id) {
    error.value = blogDetailsData.value = null
    loading.value = true
    try {
        const blogData = await instance.get(`/blog/details/`, { params: { _id } })
        blogDetailsData.value = blogData.data
        const categoryId = blogData.data.category._id
        viewCount.value = blogData.data.views
        comments.value = blogData.data.comments
        console.log('comments', comments.value)
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
    // 更新博客阅读量
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

/**
 * 评论
 */
const ruleForm = reactive({
    comment: "",
});

const validateComment = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("评论内容不能为空。"));
    }
    callback();
};
const rules = reactive({
    comment: [{ validator: validateComment, trigger: "blur" }]
})

const submitForm = (form) => {
    if (!form) return
    form.validate(async valid => {
        if (valid) {
            const params = {
                _id: curBlogId.value,
                replyId: '', //回复某个评论时，记录下那个评论的Id(时间戳)
                randomId: new Date().getTime(), // 发表评论的时间戳
                comment: ruleForm.comment,
                username: localStorage.getItem('userKey') //评论的作者
            }
            try {
                const commentResponse = await instance.post('/blog/add_comment', params)

                const commentsArr = commentResponse.data.comments
                comments.value = commentsArr
                showCommentForm.value = !!!commentsArr.length
            } catch (error) {

            }
        } else {
            ElNotification({
                title: "发表评论",
                message: '发表评论失败，请核对你填写的数据是否正确。',
                type: "error",
            });
            console.log("error submit!");
        }
    })
}

const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
}

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

/**
*评论
*/
.comments-wrapper {
    .title {
        margin-bottom: 1em;
    }

    .no-comments {
        font-style: italic;
        font-size: 18px;
        color: #666;
    }

    .comments-list {
        list-style: none;

        .comment-item {
            margin-bottom: 1.5rem;
        }

        .avatar-container {
            display: flex;
            justify-content: left;
            align-content: flex-start;

            .avatar {
                width: 3.2rem;
                height: 3.2rem;
                text-align: center;
                font-size: 2rem;
                background-color: #369;
                color: #fff;
                border-radius: 50%;
            }

            .info {
                margin-left: 0.5rem;

                .username {
                    font-size: 1.2rem;
                }

                .comment-time {
                    font-size: 0.6rem;
                    color: #999;
                }

                .comment {
                    font-size: 0.9rem;
                    margin-top: 0.4rem;
                    line-height: 1.2rem;
                }
            }
        }
    }
}
</style>
