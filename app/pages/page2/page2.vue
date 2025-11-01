<template>
<div class="title-color">
    <h1>page2</h1>
    <input type="text" v-model="count"></input>
    {{ count }}
</div>
</template> 

<script setup>
import { ref } from 'vue'
console.log('page2 init');
import utils from '$common/utils';

const count = ref(0)

</script>


<style lang="less" scoped>
.title-color { 
    color: red;
}
</style>
    