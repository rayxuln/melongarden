<template>
  <div class="home">
    <el-menu default-active="/" mode="horizontal" :router="true">
      <el-menu-item index="/">Posts</el-menu-item>
      <el-menu-item index="'/images'">Images</el-menu-item>
    </el-menu>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

/* eslint-disable */
@Options({
})
export default class Home extends Vue {}
</script>

<style scoped>

</style>
