<template>
  <div class="user-info-panel">
    <div class="user-info-panel-first">
      <div><el-avatar :size="50" :src="userAvatarURL"></el-avatar></div>
      <div>{{ userName }}</div>
      <div v-for="(t, index) in tags" :key="index"><el-tag :type="t.type">{{ t.tag }}</el-tag></div>
    </div>

    <div class="user-info-panel-second">
      <div class="user-info-panel-second-left">
        <div><el-link @click.prevent="$router.push('/user-center/posts')">Post<br>{{ postNum }}</el-link></div>
      </div>
      <div class="user-info-panel-second-right">
        <div><el-link @click.prevent="$router.push('/user-center/comments')">Comment<br>{{ replyNum }}</el-link></div>
      </div>
    </div>

    <div class="user-info-panel-third">
      <div><el-badge is-dot :hidden="!hasNewMessage"><el-link @click.prevent="$router.push('/user-center/messages')"><i class="el-icon-message"></i> Messages</el-link></el-badge></div>
      <div><el-link @click.prevent="$router.push('/user-center/personal-info')"><i class="el-icon-set-up"></i> User Center</el-link></div>
    </div>

    <div class="user-info-panel-forth">
      <div><el-link type="danger" @click.prevent="$emit('logoutClick')"><i class="el-icon-tableware"></i> Log Out</el-link></div>
    </div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    userAvatarURL: String,
    userName: String,
    tags: {
      type: Array,
      default: []
    },
    postNum: Number,
    replyNum: Number,
    hasNewMessage: Boolean
  },
  emits: ['logoutClick']
})
export default class UserInfoPanel extends Vue {}
</script>

<style scoped>
.user-info-panel{
  text-align: center;
  display: flex;
  flex-direction: column;
  align-content: center;
  padding: 15px;
}

.user-info-panel > * {
  margin-bottom: 15px;
}

.user-info-panel-first{
  padding-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.user-info-panel-second{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.user-info-panel-third{
  padding-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.user-info-panel-third > *{
  margin-bottom: 5px;
}

.user-info-panel-forth{
  margin-bottom: 0px;
}
</style>
