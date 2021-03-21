<template>
  <div class="post-page-level">
  <el-card shadow="never">
    <div class="level-box">
      <div class="level-box-left">
        <div class="level-box-user-avatar"><el-avatar size="large" shape="square"></el-avatar></div>
        <div class="level-box-user-name">{{ userName }}</div>
      </div>
      <div class="level-box-right">
        <div class="level-box-content" ref="content"></div>
        <div class="level-box-corner">
          <span> L{{ level }} {{ date }} <a class="level-box-reply" @click="$emit('replyTextClick')">Reply</a></span>
        </div>
      </div>
    </div>
  </el-card>
  </div>
</template>

<script>
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    userAvatarUrl: String,
    userName: String,
    content: String,
    level: Number,
    date: String
  },
  emits: ['replyTextClick'],
  mounted () {
    this.$refs.content.innerHTML = this.content
  },
  watch: {
    content (newValue) {
      this.$refs.content.innerHTML = newValue
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
}

.level-box-right{
  width: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.level-box-user-avatar{
  margin: 50px;
  margin-top: 75px;
  margin-bottom: 15px;
}

.level-box-user-name{
  text-align: center;
}

.level-box-corner{
  margin-top: auto;
  text-align: right;
}

.level-box-reply{
  color: #409EFF;
}
</style>
