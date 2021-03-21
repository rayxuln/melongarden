<template>
  <div class="post-page">
    <el-card shadow="never" class="post-page-body">
    <div v-if="!isLoadingPage">
    <div class="post-page-title">Welcome Everyone! {{ postId }}</div>

    <div class="post-page-level-container" v-for="l in levelList" :key="l.level">
      <post-page-level
        :userAvatarUrl="l.userAvatarUrl"
        :userName="l.userName"
        :level="l.level"
        :content="l.content"
        :date="l.date"
        @replyTextClick="onReplyTextClicked">
      </post-page-level>
    </div>

    <div class="post-page-tail">Replies: 94</div>

    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :page-size="10"
      :page-count="5"
      :total="1000">
    </el-pagination>
    </div>
    <div v-else>
      <el-skeleton :rows="7" animated />
    </div>
    </el-card>

    <el-card shadow="never">
    <div class="reply-box-container">
      <div class="reply-box-title">Reply</div>
      <rich-text-editor v-model="reply_box_textarea"></rich-text-editor>
      <el-button type="primary" @click="onReply">Reply</el-button>
    </div>
    </el-card>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'
import RichTextEditor from '@/components/RichTextEditor.vue'
import PostPageLevel from '@/components/PostPageLevel.vue'

const TEMP_LEVELS = [
  {
    userAvatarUrl: '',
    userName: 'AGoodMan',
    content: '',
    level: -1,
    date: '2021-3-17 17:45'
  },
  {
    userAvatarUrl: '',
    userName: 'ABadMan',
    content: '',
    level: -1,
    date: '2021-3-18 13:45'
  },
  {
    userAvatarUrl: '',
    userName: 'AGoodMan',
    content: 'You are such a fool.',
    level: -1,
    date: '2021-4-1 4:45'
  }
]

@Options({
  components: {
    'rich-text-editor': RichTextEditor,
    'post-page-level': PostPageLevel
  },
  data () {
    return {
      postId: '',
      reply_box_textarea: '',
      isLoadingPage: false,
      levelList: []
    }
  },
  created () {
    for (var i = 0; i < 3; ++i) {
      var obj = { ...TEMP_LEVELS[i % 3] }
      obj.level = i + 1
      this.levelList.push(obj)
    }
  },
  mounted () {
    this.postId = this.$route.params.postId
  },
  watch: {
    reply_box_textarea (newValue) {
      this.levelList[0].content = newValue
    }
  },
  methods: {
    onReply () {
      this.levelList.push({
        userAvatarUrl: '',
        userName: 'ANobody',
        content: this.reply_box_textarea,
        level: this.levelList.length + 1,
        date: '2021-3-17 17:45'
      })
      this.reply_box_textarea = ''
    },
    onReplyTextClicked () {
      window.scroll({ top: document.body.clientHeight, left: 0, behavior: 'smooth' })
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
  margin-bottom: 5px;
}

.el-pagination{
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

</style>
