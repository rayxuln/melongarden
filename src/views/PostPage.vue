<template>
  <div class="post-page">
    <el-card shadow="never" class="post-page-body">
    <div v-loading="isLoadingPage">
    <!--div class="post-page-title">{{ title }}</div-->
    <el-page-header title="" :content="title" @back="$router.go(-1)"></el-page-header>

    <div class="post-page-level-container" v-for="l in levelList" :key="l.level">
      <post-page-level
        :userAvatarUrl="l.userAvatarUrl"
        :userName="l.userName"
        :level="l.level"
        :content="l.content"
        :date="l.date"
        :isPoster="l.isPoster"
        :isYou="l.isYou"
        @replyTextClick="onReplyTextClicked">
      </post-page-level>
    </div>

    <div class="post-page-tail">Replies: {{ levelNum }}</div>

    </div>
    </el-card>

    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :page-size="pageSize"
      :page-count="5"
      :current-page="currentPage"
      :total="levelNum"
      @current-change="onCurrentPageChanged">
    </el-pagination>

    <el-card shadow="never">
    <div class="reply-box-container">
      <div class="reply-box-title">Reply</div>
      <rich-text-editor v-model="replyBoxTextArea"></rich-text-editor>
      <el-button type="primary" @click="onReply">Reply</el-button>
    </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import APIs from '@/APIs'
import { Options, Vue } from 'vue-class-component'
import RichTextEditor from '@/components/RichTextEditor.vue'
import PostPageLevel from '@/components/PostPageLevel.vue'
import { ElMessage } from 'element-plus'

@Options({
  components: {
    'rich-text-editor': RichTextEditor,
    'post-page-level': PostPageLevel
  },
  data () {
    return {
      title: '',
      postId: '',
      currentPage: 1,
      replyBoxTextArea: '',
      isLoadingPage: false,
      levelList: [],
      levelNum: 0,
      pageSize: 2
    }
  },
  created () {
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.path === '/post') {
          this.loadLevels()
        }
      }
    )
  },
  mounted () {
    this.loadLevels()
  },
  methods: {
    onReply () {
      if (this.replyBoxTextArea === '') {
        ElMessage.error('The reply content mustn\'t be empty!')
        return
      }

      APIs.reply(this.postId, this.replyBoxTextArea).then(() => {
        ElMessage.success('You\'ve just replied in a post')
        this.replyBoxTextArea = ''
        const newPage = Math.ceil((this.levelNum + 1) / this.pageSize)
        if (this.currentPage !== newPage) {
          this.$router.push(`/post?post_id=${this.postId}&page=${newPage}`)
        } else {
          this.loadLevels()
        }
      }).catch((e) => {
        ElMessage.error('Can\'t reply. ' + e)
      })
    },
    onReplyTextClicked () {
      window.scroll({ top: document.body.clientHeight, left: 0, behavior: 'smooth' })
    },
    loadLevels () {
      this.postId = this.$route.query.post_id
      let currentPage = Number.parseInt(this.$route.query.page)
      if (!currentPage) {
        currentPage = 1
      }

      this.isLoadingPage = true

      APIs.getPostInfo(this.postId).then((value) => {
        const v = value as {levelNum:number, title:string}
        this.levelNum = v.levelNum
        this.title = v.title
        this.currentPage = currentPage
        return APIs.getPostLevelList(this.postId, this.pageSize, this.currentPage)
      }).then((v) => {
        this.levelList = v
      }).catch((e) => {
        ElMessage.error('Error happing while loading post page. ' + e)
      }).then(() => {
        this.isLoadingPage = false
      })
    },
    onCurrentPageChanged (pageNumber:number) {
      this.$router.push(`/post?post_id=${this.postId}&page=${pageNumber}`)
    }
  }
})
export default class PostPage extends Vue {}
</script>

<style scope>
.post-page{
  text-align: left;
}

.post-page-body{
  margin-bottom: 15px;
}

.post-page-title{
  font-size: 24px;
  margin-bottom: 15px;
}

.post-page-tail{
  margin-top: 5px;
  margin-bottom: -5px;
}

.el-pagination{
  margin-bottom: 15px;
  text-align: center;
}

.reply-box-container{
  text-align: left;
}

.reply-box-container > div{
  margin-bottom: 15px;
}

.reply-box-title{
  font-size: 32px;
  margin: 5px;
}

.el-page-header{
  margin-bottom: 15px;
}

</style>
