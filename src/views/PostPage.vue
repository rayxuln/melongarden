<template>
  <div class="post-page">
    <el-card shadow="never" class="post-page-body">
    <div v-loading="isLoadingPage">
    <!--div class="post-page-title">{{ title }}</div-->
    <el-page-header title="" :content="title" @back="$router.push('/')"></el-page-header>

    <div class="post-page-level-container" v-for="(l, index) in levelList" :key="index">
      <post-page-level :id="`L${l.level}`"
        :class="{ pulse: l.pulse }"
        :ref="`levelRefList${index}`"
        :userAvatarUrl="l.userAvatarUrl"
        :userName="l.userName"
        :userTags="l.userTags"
        :level="l.level"
        :content="l.content"
        :date="l.date"
        :hasLike="l.hasLike"
        :likeNum="l.likeNum"
        :dislikeNum="l.dislikeNum"
        :isPoster="l.isPoster"
        :isYou="l.isYou"
        :hasEdited="l.hasEdited"
        :isLoading="l.isLoading"
        :isAdmin="l.isAdmin"
        :isPinned="l.isPinned"
        :hasDeleted="l.hasDeleted"
        @replyTextClick="onReplyTextClicked(l.level)"
        @deleteTextClick="onDeleteTextClicked(l.level)"
        @saveTextClick="onSaveTextClicked(index, $event)"
        @likeClick="onLikeClicked(index, 1)"
        @dislikeClick="onLikeClicked(index, 2)"
        @pinClick="onPinClicked"
        >
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
      :hide-on-single-page="true"
      @current-change="onCurrentPageChanged">
    </el-pagination>

    <el-card shadow="never">
    <div class="reply-box-container">
      <div class="reply-box-title">Reply</div>
      <rich-text-editor v-model="replyBoxTextArea"></rich-text-editor>
      <el-button :loading="isReplying" type="primary" @click="onReply">Reply</el-button>
    </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Tools from '@/APIs/Tools'
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
      pageSize: 7,
      isReplying: false
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

    const cache = window.localStorage.getItem('replyBoxTextArea')
    if (cache) {
      this.replyBoxTextArea = cache
    }
  },
  watch: {
    replyBoxTextArea (v) {
      window.localStorage.setItem('replyBoxTextArea', v)
    }
  },
  methods: {
    onReply () {
      if (this.replyBoxTextArea === '') {
        ElMessage.error('The reply content mustn\'t be empty!')
        return
      }

      this.isReplying = true
      APIs.reply(this.postId, this.replyBoxTextArea).then((v:unknown) => {
        const res = v as { level:number }
        ElMessage.success('You\'ve just replied in a post')
        this.replyBoxTextArea = ''
        const newPage = Math.ceil((this.levelNum + 1) / this.pageSize)
        this.$router.push(`/post?post_id=${this.postId}&page=${newPage}#L${res.level}`)
        // if (this.currentPage !== newPage) {
        //   this.$router.push(`/post?post_id=${this.postId}&page=${newPage}`)
        // } else {
        //   this.loadLevels()
        // }
      }).catch((e) => {
        ElMessage.error('Can\'t reply. ' + e)
        this.$router.push('/signin')
      }).then(() => {
        this.isReplying = false
      })
    },
    onReplyTextClicked (level:number) {
      for (const l of this.levelList) {
        if (l.level === level) {
          this.replyBoxTextArea = `<blockquote><p><strong><span style="color: #95a5a6;">@${l.userName} (L${l.level}):</span></strong></p><p>${l.content}</p></blockquote><p>&nbsp;</p>`
        }
      }
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
    onPinClicked (pin:boolean) {
      this.$confirm(`Are you sure to ${pin ? 'pinned' : 'unpinned'} this post?`, 'Warning', {
        confirmButtonText: 'Of caurse',
        cancelButtonText: 'No sure yet',
        type: 'warning'
      }).then(() => {
        APIs.pinPost(this.postId, pin).then(() => {
          ElMessage.success(`You've just ${pin ? 'pinned' : 'unpinned'} a post.`)
          this.$router.push('/')
        }).catch((e) => {
          ElMessage.error(`You can't ${pin ? 'pinned' : 'unpinned'} this post.` + e)
        })
      }).catch((e: unknown) => e)
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

        // scroll to hash level
        const hash = this.$route.hash
        if (hash.length > 2 && typeof hash === 'string' && hash[1] === 'L') {
          const level = document.getElementById(hash.substring(1))
          if (level) {
            level.scrollIntoView({ behavior: 'smooth', block: 'center' })

            const index = Number.parseInt(level.id.substring(1))
            for (const l of this.levelList) {
              if (l.level === index) {
                l.pulse = true
              }
            }
          }
        }
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
    },
    onLikeClicked (index:number, like:number) {
      const l = this.levelList[index]
      APIs.likePostLevel(this.postId, l.level, like).then(() => {
        return APIs.getPostLevelLikeInfo(this.postId, l.level)
      }).then((value) => {
        const v = value as { hasLike:number, likeNum:number, dislikeNum:number }
        l.hasLike = v.hasLike
        l.likeNum = v.likeNum
        l.dislikeNum = v.dislikeNum
      }).catch((e) => {
        ElMessage.error(`Can't ${like === 1 ? 'like' : 'dislike'} this level.` + e)
      })
    }
  }
})
export default class PostPage extends Vue {}
</script>

<style scope>
.post-page{
  text-align: left;
}

.post-page .el-card{
  overflow: visible;
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

.pulse{
  animation: pulse 1s .2s ease both;
}

@keyframes pulse{
  0%{transform:scale(1)}
  50%{transform:scale(1.1)}
  100%{transform:scale(1)}
}

blockquote {
  border-left: 2px solid #ccc;
  margin-left: 1.5rem;
  padding-left: 1rem;
}
</style>
