<template>
  <div class="posts">
    <div v-loading="isPageLoading" class="body-part">
    <transition name="fade" mode="out-in">
    <el-empty v-if="posts_is_empty" description="There is no post, yet."></el-empty>
    <div v-else>
      <!--transition-group name="fade" mode="out-in" tag="div"-->
      <div v-for="(p, index) in post_card_list" :key="index">
        <post-card
          :replyNum="p.replyNum"
          :title="p.title"
          :titleTags="p.titleTags"
          :content="p.content"
          :poster="p.poster"
          :lastReplior="p.lastReplior"
          :images="p.images"
          :updateTime="p.updateTime"
          :hasLike="p.hasLike"
          :likeNum="p.likeNum"
          :dislikeNum="p.dislikeNum"
          :routePath="`/post?post_id=${p.postId}`"
          @likeClick="onLikeClicked(index, 1)"
          @dislikeClick="onLikeClicked(index, 2)">
        </post-card>
      </div>
      <!--/transition-group-->
    </div>
    </transition>
    </div>

    <el-pagination
        v-if="!posts_is_empty"
        background
        layout="prev, pager, next, jumper"
        :page-size="page_size"
        :page-count="5"
        :total="postNum"
        :current-page="current_post_number"
        @current-change="onCurrentPageChanged">
    </el-pagination>

    <el-card shadow="never">
      <div class="post-box-container">
        <div class="post-box-title">Post</div>
        <el-input placeholder="Type the title here..." maxlength="20" show-word-limit v-model="post_box_title"></el-input>
        <!--el-input type="textarea" :rows="7" placeholder="Type something interesting here..." v-model="post_box_textarea"></el-input-->
        <rich-text-editor v-model="post_box_textarea" @images-upload-start="onImagesUploadStart" @images-upload-finished="onImagesUploadFinished"></rich-text-editor>
        <el-button :loading="post_box_post_button_loading" type="primary" @click="onPostButtonClicked">Post</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PostCard from '@/components/PostCard.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

import APIs from '@/APIs'
import { ElMessage } from 'element-plus'

@Options({
  data () {
    return {
      posts_is_empty: true,
      post_card_list: [],
      post_box_title: '',
      post_box_textarea: '',
      post_box_post_button_loading: false,
      current_post_number: 0,
      page_size: 3,
      isPageLoading: false,
      postNum: 0
    }
  },
  components: {
    'post-card': PostCard,
    'rich-text-editor': RichTextEditor
  },
  created () {
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.path === '/') {
          this.loadPosts()
        }
      }
    )
  },
  mounted () {
    this.loadPosts()
  },
  methods: {
    onCurrentPageChanged (pageNumber:number) {
      const r = {
        path: this.$route.path,
        query: { ...this.$route.query, page: pageNumber },
        hash: this.$route.hash,
        params: { ...this.$route.params }
      }
      this.$router.push(r)
    },
    loadPosts () {
      this.isPageLoading = true
      this.current_post_number = Number.parseInt(this.$route.query.page)
      if (!this.current_post_number) {
        this.current_post_number = 1
      }
      const filter = this.$route.query.search || ''
      APIs.getPostList(this.page_size, this.current_post_number, filter).then((value) => {
        const v = value as { posts:unknown, postNum:unknown }
        this.post_card_list = v.posts
        this.postNum = v.postNum

        this.posts_is_empty = this.post_card_list.length === 0
      }).catch((v) => {
        ElMessage.error('There is something wrong with the server. Please try to refresh this page in a moment. ' + v)
      }).then(() => {
        this.isPageLoading = false
      })
    },
    clearPostBox () {
      this.post_box_title = ''
      this.post_box_textarea = ''
    },
    onPostButtonClicked () {
      if (this.post_box_title === '') {
        ElMessage.error('The title mustn\'t be empty!')
        return
      }

      APIs.post(this.post_box_title, this.post_box_textarea).then(() => {
        ElMessage.success('You\'ve just posted a new post')
        this.clearPostBox()
        if (this.current_post_number !== 1 || this.$route.fullPath !== '/?page=1') {
          this.$router.push('/?page=1')
        } else {
          this.loadPosts()
        }
        this.$store.dispatch('updateMembersPosts')
      }).catch((e) => {
        ElMessage.error('Can\'t post. ' + e)
      })
    },
    onImagesUploadStart () {
      this.post_box_post_button_loading = true
    },
    onImagesUploadFinished () {
      this.post_box_post_button_loading = false
    },
    onLikeClicked (index:number, like:number) {
      const p = this.post_card_list[index]
      APIs.likePostLevel(p.postId, 1, like).then(() => {
        return APIs.getPostLevelLikeInfo(p.postId, 1)
      }).then((value) => {
        const v = value as { hasLike:number, likeNum:number, dislikeNum:number }
        p.hasLike = v.hasLike
        p.likeNum = v.likeNum
        p.dislikeNum = v.dislikeNum
      }).catch((e) => {
        ElMessage.error(`Can't ${like === 1 ? 'like' : 'dislike'} this post.` + e)
      })
    }
  }
})
export default class Posts extends Vue {}
</script>

<style scoped>
.posts .el-pagination{
  margin-top: 15px;
  margin-bottom: 15px;
}

.post-box-container{
  text-align: left;
}

.post-box-container > div{
  margin-bottom: 15px;
}

.post-box-title{
  font-size: 32px;
  margin: 5px;
}
</style>
