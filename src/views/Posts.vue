<template>
  <div class="posts">
    <el-empty v-if="posts_is_empty" description="There is no post, yet."></el-empty>
    <div v-if="!posts_is_empty">
      <div v-for="p in post_card_list" :key="p">
        <post-card
          :replyNum="p.replyNum"
          :title="p.title"
          :content="p.content"
          :poster="p.poster"
          :lastReplior="p.lastReplior"
          :showImages="p.showImages"
          :updateTime="p.updateTime">
        </post-card>
      </div>

      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="10"
        :page-count="5"
        :total="1000">
      </el-pagination>

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
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PostCard from '@/components/PostCard.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

var POST_CARD_LIST = [
  {
    replyNum: 15,
    title: 'Welcome Everyone!(1)',
    content: "Tody, I'm happy to say that this WebApp is finally done!!!!",
    poster: 'AGoodMan',
    lastReplior: 'ABadMan',
    updateTime: '17:45',
    showImages: false
  },
  {
    replyNum: 24,
    title: 'Welcome Everyone!(2)',
    content: "Tody, I'm happy to say that this WebApp is finally done!!!!",
    poster: 'ABadMan',
    lastReplior: 'AGoodMan',
    updateTime: '3-21',
    showImages: true
  },
  {
    replyNum: 344,
    title: 'Welcome Everyone!(3)',
    content: "Tody, I'm happy to say that this WebApp is finally done!!!!",
    poster: 'AGoodMan',
    lastReplior: 'ABadMan',
    updateTime: '2020-8-15',
    showImages: false
  }
]

@Options({
  data () {
    return {
      posts_is_empty: false,
      post_card_list: [],
      post_box_title: '',
      post_box_textarea: ''
    }
  },
  components: {
    'post-card': PostCard,
    'rich-text-editor': RichTextEditor
  },
  created () {
    for (var i = 0; i < 10; ++i) {
      this.post_card_list.push(POST_CARD_LIST[i % 3])
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
