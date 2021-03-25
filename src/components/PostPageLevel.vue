<template>
  <div class="post-page-level">
  <el-card shadow="never">
    <div class="level-box">
      <div class="level-box-left">
        <div class="level-box-user-avatar"><el-avatar size="large" shape="square" :src="userAvatarUrl"></el-avatar></div>
        <div class="level-box-user-name-container">
          <div class="level-box-user-name">{{ userName }}</div>
          <div v-if="isPoster"><el-tag class="poster-tag" type="warning">Poster</el-tag></div>
          <div v-if="isYou"><el-tag>You</el-tag></div>
        </div>
      </div>
      <div v-loading="isLoading" class="level-box-right">
        <rich-text-editor v-if="displayEditor" v-model="editContent"></rich-text-editor>
        <div v-else class="level-box-content" ref="content"></div>
        <div class="level-box-corner">
          <span v-if="displayEditor">L{{ level }}
            <el-link type="primary" @click.prevent="$emit('saveTextClick', editContent)">Save</el-link> |
            <el-link type="primary" @click.prevent="displayEditor = false">Cancel</el-link>
          </span>
          <span v-else>
            <span>
            <el-link
              :type="hasLike === 1 ? 'danger' : 'primary'"
              @click.prevent="$emit('likeClick')" :underline="false">
              <i class="el-icon-caret-top"></i>
              {{ likeNum }}
            </el-link>
            </span>
            <span>
            <el-link
              :type="hasLike === 2 ? 'danger' : 'primary'"
              @click.prevent="$emit('dislikeClick')" :underline="false">
              <i class="el-icon-caret-bottom"></i>
              {{ dislikeNum }}
            </el-link>
            </span>
            L{{ level }} {{ date }}
            <span v-if="hasEdited"> (Edited) </span>
            <el-link type="primary" @click.prevent="$emit('replyTextClick')">Reply</el-link>
            <span v-if="isYou"> | <el-link type="primary" @click.prevent="displayEditor = true">Edit</el-link></span>
            <span v-if="canDelete"> | <el-link type="primary" @click.prevent="$emit('deleteTextClick')">Delete</el-link></span>
            <span v-if="level === 1 && isAdmin"> | <el-link type="primary" @click.prevent="$emit('pinClick', !isPinned)">{{ pinText }}</el-link></span>
          </span>
        </div>
      </div>
    </div>
  </el-card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import RichTextEditor from '@/components/RichTextEditor.vue'

@Options({
  props: {
    userAvatarUrl: String,
    userName: String,
    content: String,
    level: Number,
    date: String,
    isPoster: Boolean,
    isYou: Boolean,
    isLoading: Boolean,
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
    },
    hasEdited: Boolean,
    isAdmin: Boolean,
    isPinned: Boolean
  },
  components: {
    'rich-text-editor': RichTextEditor
  },
  emits: [
    'replyTextClick',
    'deleteTextClick',
    'saveTextClick',
    'likeClick',
    'dislikeClick',
    'pinClick'
  ],
  data () {
    return {
      displayEditor: false,
      editContent: '666'
    }
  },
  computed: {
    canDelete () {
      return this.isYou || this.isAdmin
    },
    pinText () {
      return this.isPinned ? 'Unpin' : 'Pin'
    }
  },
  mounted () {
    this.showContent(this.content)
  },
  watch: {
    content (newValue) {
      this.showContent(newValue)
    },
    displayEditor (newValue) {
      if (newValue) {
        this.editContent = this.content
      } else {
        setTimeout(() => {
          this.showContent(this.content)
        }, 0)
      }
    }
  },
  methods: {
    showContent (html:string) {
      this.$refs.content.innerHTML = html
    }
  }
})
export default class PostPageLevel extends Vue {}
</script>

<style scope>
.level-box{
  display: flex;
  flex-direction: row;
  justify-items: stretch;
  align-items: stretch;
  margin: -20px;
}

.level-box-left{
  background-color: rgb(247, 249, 251);
  min-height: 300px;
  border-right: 1px solid #EBEEF5;
  flex: 1;
}

.level-box-right{
  flex: 10;
  padding: 15px;
  display: flex;
  flex-direction: column;
  max-width: 82.55%;
}

.level-box-content{
  height: 100%;
  overflow-x: auto;
}

.level-box-user-avatar{
  margin: 50px;
  margin-top: 75px;
  margin-bottom: 15px;
}

.level-box-user-name-container{
  text-align: center;
}

.level-box-user-name{
  margin-bottom: 15px;
}

.level-box-corner{
  margin-top: auto;
  text-align: right;
}

</style>
