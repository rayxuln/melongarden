<template>
  <div class="sign-up">
  <el-card>
    <template #header>
      Sign Up
    </template>
    <el-form ref="form" status-icon :rules="rules" :model="form">
      <el-form-item prop="user" label="E-mail">
        <el-input v-model="form.user" placeholder="User"></el-input>
      </el-form-item>
      <el-form-item prop="pwd" label="Password">
        <el-input v-model="form.pwd" placeholder="Password" show-password></el-input>
      </el-form-item>
      <el-form-item prop="repwd" label="Repeat Password">
        <el-input v-model="form.repwd" placeholder="Repeate Password" show-password></el-input>
      </el-form-item>
      <el-form-item prop="userName" label="User Name">
        <el-input v-model="form.userName" placeholder="User Name"></el-input>
      </el-form-item>
      <el-form-item prop="inviteCode" label="Invite Code">
        <el-input v-model="form.inviteCode" placeholder="Invite Code"></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-link type="primary" @click.prevent="$router.push('/signin')"> Already signed up? Sign in here.</el-link>
    </div>
    <div class="signin-button">
      <el-button :loading="isSignuping" type="primary" @click="onSignIn"> Sign Up </el-button>
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
        pwd: '',
        repwd: '',
        userName: '',
        inviteCode: ''
      },
      rules: {
        user: [
          { required: true, message: 'E-mail can\'t be empty!', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: 'Password can\'t be empty', trigger: 'blur' },
          { validator: this.pwdValidator, trigger: 'blur' }
        ],
        repwd: [
          { required: true, message: 'Repeat password can\'t be empty', trigger: 'blur' },
          { validator: this.repwdValidator, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: 'User name can\'t be empty', trigger: 'blur' }
        ],
        inviteCode: [
          { required: true, message: 'Invite code can\'t be empty', trigger: 'blur' }
        ]
      },
      isSignuping: false
    }
  },
  methods: {
    onSignIn () {
      this.$refs.form.validate((valid: boolean) => {
        if (valid) {
          this.isSignuping = true
          APIs.signup(this.form.user, this.form.pwd, this.form.userName, this.form.inviteCode).then(() => {
            ElMessage.success('Sign up successfully!')
            this.$router.push('/signin')
          }).catch((e) => {
            ElMessage.error('Can\'t sign up.' + e)
          }).then(() => {
            this.isSignuping = false
          })
        } else {
          return false
        }
      })
    },
    pwdValidator (rule: unknown, value: unknown, callback: () => void) {
      this.$refs.form.validateField('repwd')
      callback()
    },
    repwdValidator (rule: unknown, value: unknown, callback: (arg0: Error|undefined) => void) {
      if (value !== this.form.pwd) {
        callback(new Error('Password and Repeat Password must be the same!'))
      } else callback(undefined)
    }
  }
})
export default class SignIn extends Vue {}
</script>

<style>
.sign-up{
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
