<template>
  <div class="image-post-card">
    <el-card shadow="hover">
      <div class="image-post-card-content">
        <el-image class="image-post-card-img" :src="img" :preview-src-list="imgList" fit="cover"></el-image>
        <div class="image-post-card-bottom">
          <div><el-link @click.prevent="$router.push(`/post?post_id=${postId}`)"><div class="image-post-card-title">{{ title }}</div></el-link></div>
          <div class="image-post-card-bottom-content">{{ content }}</div>
          <div class="image-post-card-bottom-user">
            <div><el-avatar size="small" :src="userAvatar"></el-avatar></div>
            <div>{{ userName }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    img: String,
    imgList: Array,
    title: String,
    content: String,
    userAvatar: String,
    userName: String,
    postId: String
  }
})
export default class ImagePostCard extends Vue {}
</script>

<style>
.image-post-card-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.image-post-card-container > div {
  margin: 5px;
}
.image-post-card-content{
  width: 233px;
  height: 300px;
  margin: -20px;
  display: flex;
  flex-direction: column;
  text-align: left;
}
.image-post-card-img{
  width: 100%;
  height: 60%;
  background-color: rgb(247, 249, 251);
  border-bottom: 1px solid #EBEEF5;
}
.image-post-card-bottom{
  margin-top: auto;
  padding: 15px;
}
.image-post-card-title{
  font-size: 20px;
}
.image-post-card-bottom-content{
  margin-bottom: 15px;
}
.image-post-card-bottom-user{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.image-post-card-bottom-user > div{
  margin-right: 5px;
}
</style>
