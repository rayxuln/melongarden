<template>
  <div class="user-center">
    <el-card>
      <template #header>
        <el-page-header title="" @back="$router.push('/')" content="User Center">
        </el-page-header>
      </template>
      <div class="container">
        <el-menu :default-active="currentRoute" mode="" :router="true">
          <el-menu-item index="/user-center/personal-info"><i class="el-icon-user"></i> Personal Info</el-menu-item>
          <el-menu-item index="/user-center/messages"><i class="el-icon-message"></i> Messages</el-menu-item>
          <el-menu-item index="/user-center/posts"><i class="el-icon-postcard"></i> Posts</el-menu-item>
          <el-menu-item index="/user-center/replies"><i class="el-icon-chat-line-square"></i> Replies</el-menu-item>
        </el-menu>
        <router-view></router-view>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import APIs from '@/APIs'
import { ElMessage } from 'element-plus'
import checkToken from '@/APIs/MockerAPIs/checkToken'

@Options({
  computed: {
    currentRoute () {
      return this.$route.path
    }
  },
  created () {
    this.$watch(
      () => this.$route.query,
      () => {
        this.checkToken()
      }
    )
  },
  mounted () {
    this.checkToken()
  },
  methods: {
    checkToken () {
      APIs.checkToken().catch((e) => {
        ElMessage.error('Please sign in first!')
        this.$router.push('/signin')
      })
    }
  }
})
export default class UserCenter extends Vue {}
</script>

<style scoped>
.container{
  margin: -20px;
  min-height: 400px;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
}
</style>
