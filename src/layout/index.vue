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
                <el-header>Header</el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
  import Menu from '@/layout/components/menu/index.vue'
</script>

<style scoped lang="scss">
  .common-layout {
    width: 100%;
    height: 100vh;
    .sys-title {
        text-align: center;
    }
    .el-aside {
        width: 260px;
        height: 100vh;
        background-color: #ccc;
        .el-menu--vertical {
            height: 100vh;
        }
    }
    .el-header {
        height: 50px;
        background-color: #aaa;
    }
    .el-main {
        // background-color: #bbb;
    }
  }
</style>
  