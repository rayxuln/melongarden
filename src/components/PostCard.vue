<template>
<div class="post-card">
<el-card shadow="hover">
<div class="post-card-container">
<div class="post-card-left">
  <div class="post-card-left-reply-num"><div>{{ replyNum }}</div></div>
  <div class="post-card-left-like-dislike">
  <span>
  <el-link
    :type="hasLike === 1 ? 'danger' : 'primary'"
    @click.prevent :underline="false">
    <i class="el-icon-caret-top"></i>
    {{ likeNum }}
  </el-link>
  </span>
  <span>
  <el-link
    :type="hasLike === 2 ? 'danger' : 'primary'"
    @click.prevent :underline="false">
    <i class="el-icon-caret-bottom"></i>
    {{ dislikeNum }}
  </el-link>
  </span>
  </div>
</div>
<div class="post-card-center">
  <div class="post-card-title">
  <span class="tag-container" v-for="t in titleTags" :key="t">
    <el-tag :type="t.type">{{ t.tag }}</el-tag>
  </span>
  <router-link :to="routePath">{{ title }} </router-link>
  </div>
  <div class="post-card-content">
  {{ displayContent }}
  </div>
  <div v-if="images.length > 0" class="post-card-image-container">
    <el-image v-if="images.length >= 1" class="fake-image-box" :src="images[0].small" fit="contain" :preview-src-list="bigImageList"></el-image>
    <el-image v-if="images.length >= 2" class="fake-image-box" :src="images[1].small" fit="contain" :preview-src-list="bigImageList"></el-image>
    <el-image v-if="images.length >= 3" class="fake-image-box" :src="images[2].small" fit="contain" :preview-src-list="bigImageList"></el-image>
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

@Options({
  props: {
    replyNum: Number,
    title: String,
    titleTags: {
      type: Array,
      default: [
        { type: 'warning', tag: 'Pin' },
        { type: 'info', tag: 'Edited' }
      ]
    },
    content: String,
    poster: String,
    lastReplior: String,
    updateTime: String,
    images: Array,
    routePath: String,
    hasLike: {
      type: Number,
      default: 0 // 1 = like, 2 = dislike
    },
    likeNum: {
      type: Number,
      default: 0
    },
    dislikeNum: {
      type: Number,
      default: 0
    }
  },
  computed: {
    displayContent () {
      return this.content
    },
    bigImageList () {
      const res = []
      for (const i of this.images) {
        res.push(i.big)
      }
      return res
    }
  }
})
export default class PostCard extends Vue {}
</script>

<style scoped>
.fake-image-box{
  width: 234.5px;
  height: 174px;
  /*border: 1px solid black;
  background-color: #999999;*/
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

.post-card-left-reply-num{
  border: 1px solid #d7dae2;
  border-radius: 4px;
  text-align: center;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.post-card-left-like-dislike{
  margin-top: 15px;
}

.post-card-title > .tag-container > .el-tag{
  margin-right: 5px;
}
</style>
