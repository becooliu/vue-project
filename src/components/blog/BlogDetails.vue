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
            <el-form ref="ruleFormRef" v-if="showCommentForm" :model="ruleForm" status-icon :rules="rules"
                label-width="auto">
                <el-form-item prop="comment">
                    <el-input ref="commentInputRef" v-model="ruleForm.comment" type="textarea" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button v-show="!showReplyButton" type="primary" @click="addComment(ruleFormRef)"
                        @keyup.enter="addComment(ruleFormRef)">发表评论</el-button>
                    <el-button v-show="showReplyButton" type="primary" @click="submitReplyComment(ruleFormRef)"
                        @keyup.enter="submitReplyComment(ruleFormRef)">回复评论</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
            <!--评论列表-->
            <ul class="comments-list" v-if="comments?.length">
                <li class="comment-item" v-for="item in comments" :key="item._id">
                    <div class="avatar-container">
                        <div class="avatar">{{ item?.author?.username.slice(0, 1).toUpperCase() }}</div>
                        <div class="info">
                            <div class="username">{{ item?.author?.username }}</div>
                            <span class="comment-time">{{ formatTimeText(item.createdAt) }}</span>
                            <div class="comment">{{ item.content }} <span class="reply"
                                    @click="replyComment(item.author.username, item._id)">回复</span></div>
                        </div>
                    </div>
                    <!--回复列表-->
                    <div class="avatar-container reply-container" v-if="item.replies.length"
                        v-for="reply in item.replies">
                        <div class="avatar">{{ reply?.username.slice(0, 1).toUpperCase() }}</div>
                        <div class="info">
                            <div class="username">{{ reply.username }}<span class="reply-author">回复<em>{{
            item.author.username }}</em></span>
                            </div>
                            <span class="comment-time">{{ formatTimeText(reply.createdAt) }}</span>
                            <div class="comment">{{ reply.comment }} <span class="reply"
                                    @click="replyComment(reply.username, reply._id)">回复</span></div>
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
import { storeToRefs } from 'pinia'
import { useUserStatusStore } from '@/store/index'
const store = useUserStatusStore()
const { getLoginStatus } = storeToRefs(store)

const blogDetailsData = ref(null)
const loading = ref(false)
const error = ref(null)

const likesData = ref([])

const viewCount = ref(0)
const curBlogId = ref('')

const comments = ref([])
const ruleFormRef = ref(null)
const showCommentForm = ref(true)
const showReplyButton = ref(false)

watch(() => route.params._id, getBlogData, { immediate: true })

async function getBlogData(_id) {
    error.value = blogDetailsData.value = null
    loading.value = true
    try {
        const blogData = await instance.get(`/blog/details/`, { params: { _id } })
        const commentsData = await instance.get(`/comments/get_comment`, { params: { blogId: _id } })
        console.log('commentsData', commentsData)
        blogDetailsData.value = blogData.data
        const categoryId = blogData.data.category._id
        viewCount.value = blogData.data.views
        comments.value = commentsData.data.data.reverse()
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

const addComment = (form) => {
    if (!form) return

    if (!getLoginStatus?.value) {
        ElNotification({
            title: "用户登录",
            message: '您已退出登录，请先登录再发表评论。',
            type: "error",
        })
        return
    }
    form.validate(async valid => {
        if (valid) {
            const params = {
                blogId: curBlogId.value,
                replyId: '', //回复某个评论时，记录下那个评论的Id(时间戳)
                comment: ruleForm.comment,
                userId: localStorage.getItem('userId') //评论的作者的id
            }
            await sendCommentData(params)
        } else {
            ElNotification({
                title: "发表评论",
                message: '发表评论失败，请核对你填写的数据是否正确，且数据不能为空。',
                type: "error",
            });
            console.log("error submit!");
        }
    })
}
const sendCommentData = async (params) => {
    try {
        const commentResponse = await instance.post('/comments/add_comment', params)

        console.log('commentResponse', commentResponse)
        const commentsArr = commentResponse?.data.data

        comments.value = commentsArr.reverse()
        // showCommentForm.value = !!!commentsArr.length
        ElNotification({
            title: "发表评论",
            message: '发表评论成功。',
            type: "success",
        });
    } catch (error) {
        console.log(error)
        ElNotification({
            title: "发表评论",
            message: '发表评论失败，请查看报错信息或联系管理员。',
            type: "error",
        });
    }

}

// 格式化评论时间
function formatTimeText(timestamp) {
    let now = new Date().getTime()
    let createdTime = new Date(timestamp).getTime()
    let _time = (now - createdTime) / 1000
    let string = ''
    switch (true) {
        case (_time < 60):
            string = `刚刚`
            // Math.floor(_time / 60)
            break;
        case (_time < 60 * 60):
            string = `${Math.floor(_time / 60)}分钟前`
            // Math.floor(_time / 60)
            break;
        case (_time >= 60 * 60 && _time < 60 * 60 * 24):
            string = `${Math.floor(_time / (60 * 60))}小时前`
            break;
        case (_time >= 60 * 60 * 24 && _time < 60 * 60 * 24 * 2):
            string = `${Math.floor(_time / (60 * 60 * 24))}天前`
            break;
        case (_time >= 60 * 60 * 24 * 2):
            string = timeStringToDate(new Date(timestamp).getTime())
            break;
        default:
            string = timeStringToDate(new Date(timestamp).getTime())
    }
    return string
}

/**
 * 回复评论
 * 
 */
import { nextTick } from 'vue'
const commentInputRef = ref('')
const originCommentId = ref('')

const replyComment = (username, _id) => {
    originCommentId.value = _id
    showReplyButton.value = true
    focusInput()
    ruleForm.comment = `回复 ${username}: `
}

// 点击回复评论时，使输入框聚焦
const focusInput = () => {
    nextTick(() => {
        if (commentInputRef.value) {
            commentInputRef.value.focus()
        }
    })
}

const submitReplyComment = (form) => {
    if (!form) return
    if (!getLoginStatus?.value) {
        ElNotification({
            title: "用户登录",
            message: '您已退出登录，请先登录再发表评论。',
            type: "error",
        })
        return
    }
    form.validate(async valid => {
        if (valid) {
            const params = {
                _id: originCommentId.value,
                blogId: curBlogId.value,
                comment: ruleForm.comment.replace(/回复.*: /, ''),
                userId: localStorage.getItem('userId'), //评论的作者的id
                username: localStorage.getItem('userKey') // 评论的作者的用户名
            }
            await addReply(params)
        } else {
            ElNotification({
                title: "发表评论",
                message: '评论内容验证不通过，发表评论失败。',
                type: "success",
            })
        }
    })
}

const addReply = async (params) => {
    try {
        const replyResponse = await instance.post('/comments/add_reply', params)

        console.log('replyResponse', replyResponse)
        comments.value = replyResponse.data.data

        ElNotification({
            title: "回复评论",
            message: '回复评论成功。',
            type: "success",
        })
    } catch (error) {
        console.log(error)
        ElNotification({
            title: "回复评论",
            message: '回复评论失败，请查看报错信息或联系管理员。',
            type: "error",
        });
    }
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
        padding-inline-start: 0;

        .comment-item {
            margin-bottom: 1.5rem;
        }

        .avatar-container {
            display: flex;
            justify-content: left;
            align-content: flex-start;

            &.reply-container {
                margin-top: 0.5rem;
                margin-left: 3.2rem;

                .avatar {
                    width: 1.6rem;
                    height: 1.6rem;
                    text-align: center;
                    font-size: 1rem;
                    background-color: #369;
                    color: #fff;
                    border-radius: 50%;
                }

                .reply-author {
                    margin-left: 1em;
                    color: #999;
                    font-size: 0.9rem;
                }
            }
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
                    font-size: 1rem;
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

            .reply {
                margin-left: 0.6rem;
                color: #999;
                cursor: pointer;

                &:hover {
                    color: #369;
                }
            }
        }
    }
}
</style>
