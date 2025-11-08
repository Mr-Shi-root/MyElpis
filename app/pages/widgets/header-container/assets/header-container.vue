<template>
  <el-container class="header-container">
      <el-header class="wrap-header">
        <el-row type="flex" align="middle" class="header-row">
            <!-- 左上方 title -->
            <el-row type="flex" align="middle" class="title-panel">
                <img src="./icon.png" class="logo">
                <el-row class="text">{{ title }}</el-row>
            </el-row>
            <!-- 插槽： 菜单区域 -->
            <slot name="menu-content"></slot>
            <!-- 右上方区域 -->
            <el-row type="flex" align="middle" justify="end" class="setting-panel">
                <slot name="setting-content"></slot>
                <img src="./header.png" alt="" class="avatar" />
                <el-dropdown @command="handleUserCommand" class="user-dropdown" >
                    <span class="user-name">
                        {{ usrname }} <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-item command="logout" @click="logout">退出登录</el-dropdown-item>
                    </template>
                </el-dropdown>
            </el-row>
        </el-row>
      </el-header>
      <el-main class="main-container">
        <!-- 插槽：核心内容填充区域 -->
        <slot name="main-content"></slot>
      </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
    title: {
        type: String,
        default: '项目管理系统'
    },
    usrname: {
        type: String,
        default: '管理员'
    }
})

const userName = ref('管理员');
const handleUserCommand = function(event) {
    console.log(event);
}

</script>

<style lang='less' scoped>
.header-container{ 

    height: 100%;
    min-width: 1000px;
    overflow: hidden;
    .wrap-header{
        max-height: 120px;
        border-bottom: 1px solid #e8e8e8;
        .header-row{
            height: 60px;
            padding: 0 20px;
            .title-panel {
                width: 180px;
                min-width: 180px;
                .logo {
                    margin-right: 10px;
                    width: 25px;
                    height: 25px;
                    border-radius: 50%;
                }

                .text {
                    font-size: 15px;
                    font-weight: 500;
                }
            }
            .setting-panel {
                margin-left: auto;
                min-width: 200px;
                .avatar {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    margin: 0 15px;
                }
                .user-name {
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    height: 60px;
                    line-height: 60px;
                    outline: none;
                }
            }
        }
    }
    .main-container{}
}

:deep(.el-header){
  padding: 0 !important;
}
</style>