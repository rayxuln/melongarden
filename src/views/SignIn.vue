<template>
  <div class="sign-in">
  <el-card>
    <template #header>
      Sign In
    </template>
    <el-form ref="form" :rules="rules" :model="form">
      <el-form-item prop="user">
        <el-input v-model="form.user" placeholder="E-mail" @keyup.enter="onSignIn"><template #prefix><i class="el-icon-user"></i></template></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input v-model="form.pwd" placeholder="Password" show-password @keyup.enter="onSignIn"><template #prefix><i class="el-icon-lock"></i></template></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-link type="primary" @click.prevent="$router.push('/signup')"> Not sign up yet? You can sign up here.</el-link>
    </div>
    <div class="signin-button">
      <el-button :loading="isSignining" type="primary" @click="onSignIn"> Sign In </el-button>
    </div>
  </el-card>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import APIs from '@/APIs'
import { ElMessage } from 'element-plus'

@Options({
  data () {
    return {
      form: {
        user: '',
        pwd: ''
      },
      rules: {
        user: [
          { required: true, message: 'Please input the E-mail!', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: 'Please input the password!', trigger: 'blur' }
        ]
      },
      isSignining: false
    }
  },
  methods: {
    onSignIn () {
      this.$refs.form.validate((valid:boolean) => {
        if (valid) {
          this.isSignining = true
          APIs.signin(this.form.user, this.form.pwd).then(() => {
            this.$router.push('/')
          }).catch((e) => {
            ElMessage.error('Can\'t sign in.' + e)
          }).then(() => {
            this.isSignining = false
          })
        } else {
          return false
        }
      })
    }
  }
})
export default class SignIn extends Vue {}
</script>

<style>
.sign-in{
  margin-top: 50px;
  text-align: left;
  max-width: 600px;
  margin-right: auto;
  margin-left: auto;
}

.signin-button{
  text-align: right;
}
</style>
