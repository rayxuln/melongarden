<template>
  <div class="whole-box">
    <el-backtop :visibility-height="10" :bottom="100"></el-backtop>
    <el-affix :offset="0">
    <el-card>
    <div class="search-bar">
      <div class="search-bar-left">
        <div><router-link to="/">MelonGarden</router-link></div>
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
      <transition name="fade" mode="out-in">
      <div class="search-bar-right" v-if="displayLoginInfo">
        <el-avatar size="small" shape="square" :src="userAvatar"></el-avatar>
        <div><el-popover
          placement="bottom"
          title=""
          trigger="hover"
          @show="onUserInfoPanelShowed"
        >
        <template #reference>
          <el-badge is-dot :hidden="!userHasNewMessage"><el-link type="primary" @click.prevent="$router.push('/user-center/personal-info')" href="/user-center/personal-info">{{ `${userName} (${userEmail})` }}</el-link></el-badge>
        </template>
        <user-info-panel
          v-loading="userInfoLoading"
          :userAvatarURL="userAvatar"
          :userName="userEmail"
          :postNum="userPostNum"
          :replyNum="userReplyNum"
          :hasNewMessage="userHasNewMessage"
          :tags="userTags"
          @logoutClick="onLogoutClicked"
        ></user-info-panel>
        </el-popover></div>
        <div> <!-- 签到 -->
        <el-popover
          placement="bottom"
          title=""
          trigger="click"
          :width="300"
          @show="onCheckInPanelShowed"
        >
        <template #reference>
          <el-link type="primary" href="javascript:" @click.prevent>Check In</el-link>
        </template>
          <check-in-panel
            v-loading="checkInPanel.loading"
            :dateData="checkInPanel.data"
            :month="checkInPanel.month"
            :hasCheckedIn="checkInPanel.hasCheckedIn"
            @check-in="onCheckIn"
          >
          </check-in-panel>
        </el-popover>
        </div> <!-- 签到 -->
      </div>
      <div class="search-bar-right" v-else>
        <el-button type="success" @click="this.$router.push('/signup')">Sign Up</el-button>
        <el-button @click="this.$router.push('/signin')">Sign In</el-button>
      </div>
      </transition>
    </div>
    </el-card>
    </el-affix>
    <el-card class="header">
      <div class="subheader">
        <div :span="6">
        <router-link to="/">
        <img v-loading="loadingTitleImage" class="logo-img" :src="titleImageURL"/>
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

<script lang="ts">
import APIs from '@/APIs'
import Tools from '@/APIs/Tools'
import { ElMessage } from 'element-plus'

import { Options, Vue } from 'vue-class-component'

import UserInfoPanel from '@/components/UserInfoPanel.vue'
import CheckInPanel from '@/components/CheckInPanel.vue'

@Options({
  name: 'App',
  components: {
    'user-info-panel': UserInfoPanel,
    'check-in-panel': CheckInPanel
  },
  data () {
    return {
      displayLoginInfo: false,
      userName: 'UserName',
      userEmail: 'xxx@xxx.xx',
      userAvatar: '',
      userPostNum: 0,
      userReplyNum: 0,
      userHasNewMessage: false,
      userInfoLoading: false,
      userTags: [],
      searchFilter: '',
      titleImageURL: '',
      loadingTitleImage: false,
      checkInPanel: {
        loading: false,
        hasCheckedIn: false,
        month: 6,
        data: []
      }
    }
  },
  created () {
    this.$watch(
      () => this.$route.path,
      () => {
        this.loadMembersPosts()
      }
    )

    APIs.checkAPI()

    setInterval(() => {
      if (this.displayLoginInfo) {
        APIs.checkNewMessage().then((v:unknown) => {
          const res = v as { hasMsg:boolean }
          this.userHasNewMessage = res.hasMsg
        })
      }
    }, 5000)

    // handle 404 redirect
    const key = 'spa_melongarden_404_redirect_url'
    const url = window.localStorage.getItem(key)
    if (url) {
      this.$router.push(url)
      console.log('redirect to: ' + key)
      window.localStorage.removeItem(key)
    }
  },
  mounted () {
    console.log(process.env.BASE_URL)
    document.title = 'Melon Garden'
    const query = Tools.locationSearchToQuery(window.location.search)
    this.searchFilter = query.search || ''
    this.loadMembersPosts()

    this.loadingTitleImage = true
    APIs.getTitleImage().then((v:unknown) => {
      const res = v as { url:string }
      this.titleImageURL = res.url
    }).catch((e:unknown) => {
      ElMessage.error('Can\'t get title image.' + e)
    }).then(() => {
      this.loadingTitleImage = false
    })
  },
  methods: {
    onLogoutClicked () {
      this.displayLoginInfo = false
      const r = {
        path: this.$route.path,
        query: { ...this.$route.query, login: 'no' },
        hash: this.$route.hash,
        params: { ...this.$route.params }
      }
      APIs.logout()
      this.$router.push(r)
      setTimeout(() => {
        this.$router.go(-1)
        this.loadMembersPosts()
      }, 1000)
    },
    onUserInfoPanelShowed () {
      this.userInfoLoading = true
      APIs.getUserInfo().then((value:unknown) => {
        const v = value as { userPostNum:number, userReplyNum:number, userTags:unknown }
        this.userPostNum = v.userPostNum
        this.userReplyNum = v.userReplyNum
        this.userTags = v.userTags
      }).catch((e:unknown) => {
        ElMessage.error('Can\'t get user info.' + e)
      }).then(() => {
        this.userInfoLoading = false
      })
    },
    loadMembersPosts () {
      this.$store.dispatch('updateMembersPosts')

      APIs.checkToken().then((v:unknown) => {
        const res = v as { userName:string, userAvatar:string, userEmail:string }
        this.userName = res.userName
        this.userEmail = res.userEmail
        this.userAvatar = res.userAvatar
        this.displayLoginInfo = true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((_e:unknown) => {
        this.displayLoginInfo = false
      })
    },
    onSearchButtonClicked () {
      const r = {
        path: this.$route.path,
        query: { ...this.$route.query, search: this.searchFilter, page: 1 },
        hash: this.$route.hash,
        params: { ...this.$route.params }
      }
      this.$router.push(r)
    },
    onCheckInPanelShowed () {
      this.loadCheckInPanelInfo()
    },
    loadCheckInPanelInfo () {
      this.checkInPanel.loading = true
      APIs.getUserCheckInRecords().then((v:unknown) => {
        const res = v as { month:number, records:Array<boolean>, hasCheckedIn:boolean }
        this.checkInPanel.month = res.month
        this.checkInPanel.data = res.records
        this.checkInPanel.hasCheckedIn = res.hasCheckedIn
      }).catch((e:unknown) => {
        ElMessage.error('Can\'t load check in info.' + e)
      }).then(() => {
        this.checkInPanel.loading = false
      })
    },
    onCheckIn () {
      APIs.checkIn().then(() => {
        this.loadCheckInPanelInfo()
      }).catch((e:unknown) => {
        ElMessage.error('Can\'t check in.' + e)
      })
    }
  }
})
export default class App extends Vue {}
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

.search-bar-right > *{
  margin-left: 8px;
}

a {
  color: #606266;
  text-decoration: none;
}

a:visited {
  color: #606266;
  text-decoration: none;
}

a:hover {
  color: #409eff;
  text-decoration: underline;
}

a:active {
  text-decoration: none;
}
</style>
