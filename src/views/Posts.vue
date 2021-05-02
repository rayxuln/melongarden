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
        :hide-on-single-page="true"
        @current-change="onCurrentPageChanged">
    </el-pagination>

    <el-card shadow="never" class="post-box-el-card">
      <div class="post-box-container">
        <div class="post-box-title">Post</div>
        <el-input placeholder="Type the title here..." maxlength="50" show-word-limit v-model="post_box_title"></el-input>
        <!--el-input type="textarea" :rows="7" placeholder="Type something interesting here..." v-model="post_box_textarea"></el-input-->
        <rich-text-editor v-model="post_box_textarea" @images-upload-start="onImagesUploadStart" @images-upload-finished="onImagesUploadFinished"></rich-text-editor>
        <el-button :loading="postBoxPostButtonLoading" type="primary" @click="onPostButtonClicked">Post</el-button>
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
      postBoxPostButtonLoading: false,
      current_post_number: 0,
      page_size: 7,
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

    let cache = null
    cache = window.localStorage.getItem('post_box_title')
    if (cache) {
      this.post_box_title = cache
    }
    cache = window.localStorage.getItem('post_box_textarea')
    if (cache) {
      this.post_box_textarea = cache
    }
  },
  watch: {
    post_box_title (v) {
      window.localStorage.setItem('post_box_title', v)
    },
    post_box_textarea (v) {
      window.localStorage.setItem('post_box_textarea', v)
    }
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
      APIs.getPostList(this.page_size, this.current_post_number, filter).then((value:unknown) => {
        const v = value as { posts:unknown, postNum:unknown }
        this.post_card_list = v.posts
        this.postNum = v.postNum

        this.posts_is_empty = this.post_card_list.length === 0
      }).catch((v:unknown) => {
        ElMessage.error('Can\'t get post list.' + v)
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

      this.postBoxPostButtonLoading = true
      APIs.post(this.post_box_title, this.post_box_textarea).then(() => {
        ElMessage.success('You\'ve just posted a new post')
        this.clearPostBox()
        if (this.current_post_number !== 1 || this.$route.fullPath !== '/?page=1') {
          this.$router.push('/?page=1')
        } else {
          this.loadPosts()
        }
        this.$store.dispatch('updateMembersPosts')
      }).catch((e:unknown) => {
        ElMessage.error('Can\'t post. ' + e)
        this.$router.push('/signin')
      }).then(() => {
        this.postBoxPostButtonLoading = false
      })
    },
    onImagesUploadStart () {
      this.postBoxPostButtonLoading = true
    },
    onImagesUploadFinished () {
      this.postBoxPostButtonLoading = false
    },
    onLikeClicked (index:number, like:number) {
      const p = this.post_card_list[index]
      APIs.likePostLevel(p.postId, 1, like).then(() => {
        return APIs.getPostLevelLikeInfo(p.postId, 1)
      }).then((value:unknown) => {
        const v = value as { hasLike:number, likeNum:number, dislikeNum:number }
        p.hasLike = v.hasLike
        p.likeNum = v.likeNum
        p.dislikeNum = v.dislikeNum
      }).catch((e:unknown) => {
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

.post-box-el-card{
  margin-top: 15px;
}
</style>
