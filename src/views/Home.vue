<template>
  <div class="home">
    <el-menu default-active="1" mode="horizontal">
      <el-menu-item index="1">Posts</el-menu-item>
      <el-menu-item index="2">Images</el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}
</script>
