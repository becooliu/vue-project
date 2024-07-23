<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <el-scrollbar class="scrollbar">
                    <!-- 菜单组件-->
                    <Menu />
                </el-scrollbar>
            </el-aside>
            <el-container>
                <el-header class="layout-header">
                    <Breadcrumb />
                    <UserNavComp />
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import Menu from '@/layout/components/menu/index.vue'
import Breadcrumb from './components/breadcrumb/bread.vue'
import UserNavComp from '@/layout/components/usernav/UserNavComp.vue'
</script>

<style scoped lang="scss">
@import '@/styles/variable.scss';

.common-layout {
    width: 100%;
    height: 100vh;

    .sys-title {
        text-align: center;
    }

    .el-aside {
        width: 260px;
        height: 100vh;
        border-right: 1px solid #ccc;

        .el-menu--vertical {
            height: 100vh;
        }
    }

    .layout-header {
        display: flex;
        justify-content: space-between;
    }

    .el-header {
        height: $base-header-height;
        line-height: $base-header-height;
        border-bottom: 1px solid #ccc;
    }
    .el-main {
        // background-color: #bbb;
    }
  }
</style>
  