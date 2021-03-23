<template>
<div class="post-card">
<el-card shadow="hover">
<div class="post-card-container">
<div class="post-card-left">
  <el-card shadow="never">{{ replyNum }}</el-card>
</div>
<div class="post-card-center">
  <div class="post-card-title">
  <router-link :to="routePath">{{ title }} </router-link>
  </div>
  <div class="post-card-content">
  {{ displayContent }}
  </div>
  <div v-if="showImages" class="post-card-image-container">
    <div class="fake-image-box"></div>
    <div class="fake-image-box"></div>
    <div class="fake-image-box"></div>
  </div>
</div>
<div class="post-card-right">
  <div class="post-card-poster"><i class="el-icon-user-solid"></i>{{ poster }}</div>
  <div class="post-card-last-relpior"><i class="el-icon-s-comment"></i>{{ lastReplior }}</div>
</div>
<div class="post-card-right-time">
  {{ updateTime }}
</div>
</div>
</el-card>
</div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

const MAX_CONTENT_LEGNTH = 55
const MAX_TITLE_LEGNTH = 20

@Options({
  props: {
    replyNum: Number,
    title: String,
    content: String,
    poster: String,
    lastReplior: String,
    updateTime: String,
    showImages: Boolean,
    routePath: String
  },
  computed: {
    displayContent () {
      return this.content
    }
  }
})
export default class PostCard extends Vue {}
</script>

<style scoped>
.fake-image-box{
  width: 234.5px;
  height: 174px;
  border: 1px solid black;
  background-color: #999999;
}

.post-card-title{
  font-size: 24px;
}

.post-card-right, .post-card-right-time{
  font-size: 10px;
  color: #999999;
}

.post-card-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: left;
}

.post-card-image-container{
  display: flex;
  flex-direction: row;
}

.post-card-image-container > *{
  margin-right: 5px;
}

.post-card-center{
  width: 700px;
}

.post-card-center > *{
  margin-bottom: 15px;
}

.post-card-right-time{
  margin-top: 15px;
}

.post-card-left > .el-card{
  padding: 10px;
}
</style>
