<template>
<div class="title-color">
    <h1>page1</h1>
    <input type="text" class="xyx-lh" v-model="count"></input>
    {{ count }}111
</div>
</template> 

<script setup>
import { ref } from 'vue'
import utils from '$common/utils';
console.log('page1 init');

const count = ref(0) 

</script>


<style lang="less" scoped>
h1 {
  color: bisque;
}
.title-color { 
    color: red;
}
.xyx-lh{
  width: 100px;
  height: 100px;
}
</style>
