<template>
  <div class="post-page">
    <el-card shadow="never" class="post-page-body">
    <div v-loading="isLoadingPage">
    <!--div class="post-page-title">{{ title }}</div-->
    <el-page-header title="" :content="title" @back="$router.push('/')"></el-page-header>

    <div class="post-page-level-container" v-for="(l, index) in levelList" :key="index">
      <post-page-level
        :ref="`levelRefList${index}`"
        :userAvatarUrl="l.userAvatarUrl"
        :userName="l.userName"
        :level="l.level"
        :content="l.content"
        :date="l.date"
        :isPoster="l.isPoster"
        :isYou="l.isYou"
        :hasEdited="l.hasEdited"
        :isLoading="l.isLoading"
        @replyTextClick="onReplyTextClicked"
        @deleteTextClick="onDeleteTextClicked(l.level)"
        @saveTextClick="onSaveTextClicked(index, $event)">
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
      :total="filteredLevelNum"
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
import { PrismHighlightAll } from '@/plugins/prism_wrap'

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
      filteredLevelNum: 0,
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
    onDeleteTextClicked (level:number) {
      this.$confirm('Are you sure to delete this level?', 'Warning', {
        confirmButtonText: 'Of caurse',
        cancelButtonText: 'No sure yet',
        type: 'warning'
      }).then(() => {
        APIs.deletePostLevel(this.postId, level).then((value) => {
          const v = value as { hasDeletePost:boolean }
          if (v.hasDeletePost) { // go to post list page
            this.$router.push('/')
            ElMessage.success('You\'ve just deleted a post.')
          } else { // refresh current page
            this.loadLevels()
            ElMessage.success('You\'ve just deleted a level.')
          }
        }).catch((e) => {
          ElMessage.error('Can\'t delete this level.' + e)
        })
      }).catch((e: unknown) => e)
    },
    onSaveTextClicked (index:number, content: string) {
      const levelRef = this.$refs[`levelRefList${index}`]
      const l = this.levelList[index]
      l.isLoading = true
      APIs.editPostLevel(this.postId, l.level, content).then(() => {
        levelRef.displayEditor = false
        ElMessage.success('Edit has been saved.')
        return APIs.getPostLevel(this.postId, l.level)
      }).catch((e) => {
        ElMessage.error('Can\'t save.' + e)
      }).then((value) => {
        const v = value as { level:unknown }
        this.levelList[index] = v.level
      }).catch((e) => {
        ElMessage.error('Can\'t fetch level data.' + e)
      })
    },
    loadLevels () {
      this.postId = this.$route.query.post_id
      let currentPage = Number.parseInt(this.$route.query.page)
      if (!currentPage) {
        currentPage = 1
      }
      const filter = this.$route.query.search || ''

      this.isLoadingPage = true

      APIs.getPostInfo(this.postId).then((value) => {
        const v = value as {levelNum:number, title:string}
        this.levelNum = v.levelNum
        this.title = v.title
        return APIs.getPostLevelList(this.postId, this.pageSize, currentPage, filter)
      }).then((value) => {
        const v = value as { levels:unknown, levelNum:number }
        this.levelList = v.levels
        this.levelRefList = []
        this.filteredLevelNum = v.levelNum
        if (this.currentPage !== currentPage) {
          this.currentPage = -1
        }
        this.currentPage = currentPage

        this.$nextTick(() => {
          PrismHighlightAll()
        })
      }).catch((e) => {
        ElMessage.error('Error happing while loading post page. ' + e)
      }).then(() => {
        this.isLoadingPage = false
      })
    },
    onCurrentPageChanged (pageNumber:number) {
      const r = {
        path: this.$route.path,
        query: { ...this.$route.query, page: pageNumber },
        hash: this.$route.hash,
        params: { ...this.$route.params }
      }
      this.$router.push(r)
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
