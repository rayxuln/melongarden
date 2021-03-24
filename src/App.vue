<template>
  <div class="whole-box">
    <el-backtop :visibility-height="10" :bottom="100"></el-backtop>
    <el-affix :offset="0">
    <el-card>
    <div class="search-bar">
      <div class="search-bar-left">
        <div>MelonGarden</div>
        <el-input
          placeholder="Type something to search"
          prefix-icon="el-icon-search"
          v-model="searchFilter"
          @change="onSearchButtonClicked"
          clearable>
          <template #append>
            <el-button icon="el-icon-search" @click="onSearchButtonClicked"></el-button>
          </template>
        </el-input>
      </div>
      <div class="search-bar-right" v-if="display_login_info">
        <el-avatar size="small" shape="square" :src="userAvatar"></el-avatar>
        <div>{{ userName }}</div>
      </div>
      <div class="search-bar-right" v-if="!display_login_info">
        <el-button type="success">Sign Up</el-button>
        <el-button @click="onSignInButtonPressed">Sign In</el-button>
      </div>
    </div>
    </el-card>
    </el-affix>
    <el-card class="header">
      <div class="subheader">
        <div :span="6">
        <router-link to="/">
        <img class="logo-img" src="./assets/logo.png"/>
        </router-link>
        </div>
        <div :span="18" class="right-title">
          <div class="subdescription">A wanderful community for whom want to communicate</div>
          <div class="big-title">MelonGarden</div>
        </div>
      </div>
      <div class="status">Members: {{ $store.state.memberNum }} Posts: {{ $store.state.postNum }}</div>
    </el-card>
    <div class="main-body">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div class="footer">
      ©2021 MelonGarden | Design By Raiix |
      <router-link to="/about">About</router-link> |
      Contact
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import APIs from '@/APIs'
import Tools from '@/APIs/Tools'
import { ElMessage } from 'element-plus'

import Mocker from '@/APIs/Mocker'

export default {
  name: 'App',
  data () {
    return {
      display_login_info: false,
      userName: 'UserName',
      userAvatar: '',
      searchFilter: ''
    }
  },
  created () {
    this.$watch(
      () => this.$route.path,
      (newPath, oldPath) => {
        this.loadMembersPosts()
      }
    )
  },
  mounted () {
    console.log(process.env.BASE_URL)
    const query = Tools.locationSearchToQuery(window.location.search)
    this.searchFilter = query.search || ''
    this.loadMembersPosts()
  },
  methods: {
    onSignInButtonPressed () {
      Mocker.loginTestUser()
      this.$router.push('/?logining')
      setTimeout(() => {
        this.$router.push('/')
        this.loadMembersPosts()

        APIs.checkToken().then((res) => {
          this.display_login_info = true
          this.userName = res.userName
          this.userAvatar = res.userAvatar
        }).catch((v) => {
          this.display_login_info = false
          ElMessage.error("Check token fail. " + v)
        })
      }, 1000)
    },
    loadMembersPosts() {
      this.$store.dispatch('updateMembersPosts')
    },
    onSearchButtonClicked () {
      const r = {
        path: this.$route.path,
        query: {...this.$route.query, search: this.searchFilter, page: 1},
        hash: this.$route.hash,
        params: {...this.$route.params}
      }
      this.$router.push(r)
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

#app{
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
}

.logo-img{
  width: 230px;
  height: 150px;
}

.right-title{
  text-align: left;
  padding-left: 15px;
  line-height: 1;
  display: flex;
  flex-direction: column-reverse;
}

.subheader{
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.big-title{
  font-size: 72px;
  line-height: 1;
}

.status{
  text-align: left;
  margin-top: 35px;
}

.subdescription{
  color:#999999;
}

.whole-box{
  width: 1024px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
}

.header{
  padding: 15px;
  padding-bottom: 5px;
  padding-top: 50px;
  margin-bottom: 15px;
}

.footer{
  text-align: center;
  color: #999999;
  margin-bottom: 50px;
  margin-top: 50px;
}

.main-body{
  text-align: center;
  min-height: 500px;
}

.line-box-border{
  border: #333;
  border-width: 1px;
  border-style: solid;
}

.user-icon{
  width: 32px;
  height: 32px;
  border-radius: 25%;
}

.search-bar{
  padding: 3px;
  background-color: white;
  padding-left: 35px;
  padding-right: 15px;
  margin: -15px;
  /*box-shadow: 0px 5px 5px rgba(43, 43, 43, 0.112);*/
}

.search-bar, .search-bar-left, .search-bar-right{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.search-bar-right{
  margin-left: auto;
}

.search-bar .el-input{
  width: 400px;
}

.search-bar-left div, .search-bar .el-input, .search-bar .el-button{
  margin-right: 8px;
}

.search-bar-right div{
  margin-left: 8px;
}

</style>
