<template>
  <div class="posts">
    <transition name="fade" mode="out-in">
    <el-empty v-if="posts_is_empty" description="There is no post, yet."></el-empty>
    <div v-else>
      <transition-group name="fade" mode="out-in" tag="div">
      <div v-for="p in post_card_list" :key="p">
        <post-card
          :replyNum="p.replyNum"
          :title="p.title"
          :content="p.content"
          :poster="p.poster"
          :lastReplior="p.lastReplior"
          :showImages="p.showImages"
          :updateTime="p.updateTime"
          @click="onPostCardClicked(p.postId)">
        </post-card>
      </div>
      </transition-group>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="page_size"
        :page-count="5"
        :total="$store.state.postNum"
        :current-page="current_post_number"
        @current-change="onCurrentPageChanged">
      </el-pagination>
    </div>
    </transition>

    <el-card shadow="never">
      <div class="post-box-container">
        <div class="post-box-title">Post</div>
        <el-input placeholder="Type the title here..." maxlength="20" show-word-limit v-model="post_box_title"></el-input>
        <!--el-input type="textarea" :rows="7" placeholder="Type something interesting here..." v-model="post_box_textarea"></el-input-->
        <rich-text-editor v-model="post_box_textarea"></rich-text-editor>
        <el-button type="primary">Post</el-button>
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

var POST_CARD_LIST = [
  {
    replyNum: 15,
    title: 'Welcome Everyone!(1)',
    content: "Tody, I'm happy to say that this WebApp is finally done!!!!",
    poster: 'AGoodMan',
    lastReplior: 'ABadMan',
    updateTime: '17:45',
    showImages: false,
    postId: '0'
  },
  {
    replyNum: 24,
    title: 'Welcome Everyone!(2)',
    content: "Tody, I'm happy to say that this WebApp is finally done!!!!",
    poster: 'ABadMan',
    lastReplior: 'AGoodMan',
    updateTime: '3-21',
    showImages: true,
    postId: '1'
  },
  {
    replyNum: 344,
    title: 'Welcome Everyone!(3)',
    content: "Tody, I'm happy to say that this WebApp is finally done!!!!",
    poster: 'AGoodMan',
    lastReplior: 'ABadMan',
    updateTime: '2020-8-15',
    showImages: false,
    postId: '2'
  }
]

@Options({
  data () {
    return {
      posts_is_empty: true,
      post_card_list: [],
      post_box_title: '',
      post_box_textarea: '',
      current_post_number: 0,
      page_size: 1
    }
  },
  components: {
    'post-card': PostCard,
    'rich-text-editor': RichTextEditor
  },
  created () {
    this.$watch(
      () => this.$route.query,
      (newQuery:Record<string, unknown>, oldQuery:Record<string, unknown>) => {
        this.loadPosts()
      }
    )
  },
  mounted () {
    this.loadPosts()
  },
  methods: {
    onPostCardClicked (postId:string) {
      this.$router.push(`/post?post_id=${postId}`)
    },
    onCurrentPageChanged (pageNumber:number) {
      this.$router.push(`/?cpn=${pageNumber}`)
    },
    loadPosts () {
      this.post_card_list = []
      this.current_post_number = Number.parseInt(this.$route.query.cpn) // cpn == current_post_number
      if (!this.current_post_number) {
        this.current_post_number = 1
      }
      APIs.getPostList(this.page_size, this.current_post_number).then((posts) => {
        this.post_card_list = posts

        this.posts_is_empty = this.post_card_list.length === 0
      }).catch((v) => {
        ElMessage.error('There is something wrong with the server. Please try to refresh this page in a moment. ' + v)
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
