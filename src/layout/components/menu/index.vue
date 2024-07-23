<template>
    <h5 class="sys-title">博客管理 V1.0</h5>
    <el-menu router default-active="1" :default-openeds="['1']" class="el-menu-vertical-demo" active-color="#409eff">
        <el-sub-menu index="1">
            <template #title>
                <el-icon>
                    <platform />
                </el-icon>
                <span>Dashboard</span>
            </template>
            <el-menu-item index="/admin/userlist">数据总览</el-menu-item>
            <el-menu-item index="/getApiVisited">分析</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
            <template #title>
                <el-icon>
                    <Menu />
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
                <span>分类修改</span>
            </el-menu-item>
            <el-menu-item index="/category/remove">
                <el-icon>
                    <Delete />
                </el-icon>
                <span>分类删除</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
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
                <span>角色添加</span>
            </el-menu-item>
            <el-menu-item index="/roles/update">
                <el-icon>
                    <Edit />
                </el-icon>
                <span>角色修改</span>
            </el-menu-item>
            <el-menu-item index="/roles/remove">
                <el-icon>
                    <Delete />
                </el-icon>
                <span>角色删除</span>
            </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="4">
            <template #title>
                <el-icon>
                    <Avatar />
                </el-icon>
                <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/userlist">用户列表</el-menu-item>
            <el-menu-item index="2-3">重置密码</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Platform,
  Menu,
  Management,
  Plus,
  Edit,
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
    .sys-title {
        height: 50px;
        margin-top: 0;
        margin-bottom: 0;
        line-height: 50px;
        text-align: center;
    }
</style>
