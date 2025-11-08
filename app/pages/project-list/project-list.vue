<template>
  <header-container title="项目列表" usrname="小宁">
    <template #main-content>
      <div v-loading="loading">
        <div v-for="item in modelList" :key="item.model?.key">
          <!-- 展示model  -->
          <div class="model-panel">
            <el-row type="flex" align="middle">
              <div class="title">{{ item.model?.name }}</div>
            </el-row>
            <div class="divider"></div>
          </div>
          <!-- 展示 project -->
           <el-row flex class="project-list">
            <el-card v-for="projItem in item.project" :key="projItem.key" class="project-item">
              <template #header>
                <div class="title">
                  <span>{{ projItem.name }}</span>
                </div>
              </template>
              <div class="content">
                {{ projItem.desc ?? '----' }}
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button link type="primary" @click="onEnter(projItem)">
                    进入
                  </el-button>
                </el-row>
              </template>
            </el-card>
           </el-row>
        </div>
      </div>
    </template>
  </header-container>
</template>

<script setup>
const { ref } = Vue;
import $curl from  '$common/curl.js';
import headerContainer from '../widgets/header-container/assets/header-container.vue';
import { errorMessages } from 'vue/compiler-sfc';
import { onMounted } from 'vue';


const loading = ref(false);
const modelList = ref([]);
async function getMList() {
  loading.value = true;
  const res = await $curl({
    methods: 'get',
    url: '/api/project/model_list',
    errorMessage: 'xxxxx失败'
  });
  loading.value = false;
  console.log('res: ', res);
  

  if (!res || !res.success || !res.data) {
    return;
  }

  modelList.value = res.data;

  console.log(modelList.vlue);
  
}

onMounted(() => {
  getMList();
});

const onEnter = (projItem) => {
  console.log(`跳转到${projItem.name}`);
  
}
</script>

<style lang='less' scoped>
.model-panel {
  margin: 20px 50px;
  min-width: 500px;
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #6d6c6c; 
  }
  .divider {
    margin: 10px 0;
    border-bottom: 1px dashed #d7d7d7;
    width: 200px;
  }
}
.project-list {
  padding: 0 50px;
  .project-item {
    width: 240px;
    margin: 10px;
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    .content {
      min-height: 60px;
      margin: 10px 0;
      color: #8c8c8c;
      font-size: 14px;
    }
  }
}
</style>