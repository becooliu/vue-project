<template>
    <h5 class="sys-title">博客管理 V1.0</h5>
    <el-menu router default-active="1" :default-openeds="['1']" class="el-menu-vertical-demo manage-menu"
        active-color="#409eff">
        <el-sub-menu index="1">

            <template #title>
                <el-icon>
                    <DataAnalysis />
                </el-icon>
                <span>管理面板</span>
            </template>

            <el-menu-item index="/getApiVisited">
                <el-icon>
                    <View />
                </el-icon>
                <span>数据总览</span>
            </el-menu-item>
            <el-menu-item index="1">
                <el-icon>
                    <Coin />
                </el-icon>
                <span>分析</span>
            </el-menu-item>


        </el-sub-menu>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <Notebook />
                </el-icon>
                <span>博客管理</span>
            </template>
            <el-menu-item index="/blog/lists">
                <el-icon>
                    <List />
                </el-icon>
                <span>博客列表</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
            <template #title>
                <el-icon>
                    <Menu></Menu>
                </el-icon>
                <span>分类管理</span>
            </template>
            <el-menu-item index="/blog_category/add">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>分类添加</span>
            </el-menu-item>
            <el-menu-item index="/category/update">
                <el-icon>
                    <Edit />
                </el-icon>
                <span>分类维护</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
            <template #title>
                <el-icon>
                    <Management />
                </el-icon>
                <span>角色管理</span>
            </template>
            <el-menu-item index="/roles/create">
                <el-icon>
                    <Plus />
                </el-icon>
                <span>新增角色</span>
            </el-menu-item>
            <el-menu-item index="/roles/list">
                <el-icon>
                    <Edit />
                </el-icon>
                <span>编辑角色</span>
            </el-menu-item>
            <el-menu-item index="/roles/permissionEdit">
                <el-icon>
                    <EditPen />
                </el-icon>
                <span>权限管理</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="5">
            <template #title>
                <el-icon>
                    <Avatar />
                </el-icon>
                <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/userlist">
                <el-icon>
                    <List></List>
                </el-icon>
                <span>用户列表</span>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Platform,
    DataAnalysis,
    Notebook,
    View,
    Coin,
    List,
    Menu,
    Management,
    Plus,
    Edit,
    EditPen,
    Delete,
    Avatar
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
</script>

<style lang="scss">
.manage-menu {
    border-right: none;
}
    .sys-title {
        height: 50px;
        margin-top: 0;
        margin-bottom: 0;
        line-height: 50px;
        text-align: center;
    }
</style>
