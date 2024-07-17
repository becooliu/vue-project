<template>
    <div class="link-box">
        <h3>Index page</h3>
        <el-link class="link-item" href="/user/login" target="_self">已有账号？去登录</el-link>
        <el-link class="link-item" href="/user/regist" target="_self">没有账号？注册</el-link>
    </div>
</template>
<style scoped lang="scss">
    .link-box {
        margin-top: 20px;
        line-height: 30px;
        text-align: center;
        .link-item {
            margin-right: 15px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>