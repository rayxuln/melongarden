<template>
  <div v-loading="isSaving" class="personal-information">
    <div v-if="currentPanel==='info'" class="info-container">
      <div class="info-container-head">
        <div><el-avatar :size="64" :src="userAvatar" shape="square"></el-avatar></div>
        <div class="info-container-head-right">
          <div class="info-container-head-right-name">{{ userName }} ({{ userEmail }})</div>
          <div class="info-container-head-right-tag-list">
            <el-tag v-for="tag in userTags" :key="tag" :type="tag.type">{{ tag.tag }}</el-tag>
          </div>
        </div>
      </div>
      <div class="info-container-middle">
        {{ userDes }}
      </div>
      <div class="info-container-foot">
        <el-button class="info-container-foot-edit" type="primary" @click="currentPanel='edit'">Edit</el-button>
        <el-button class="info-container-foot-reset" type="danger" @click="currentPanel='reset'">Reset Password</el-button>
        <el-button class="info-container-foot-delete" type="danger" @click="onDeleteAccountClicked">Delete Account</el-button>
      </div>
    </div>

    <div v-else-if="currentPanel==='edit'" class="edit-container">
      <div class="edit-container-title">Edit Your Personal Information</div>
      <el-divider></el-divider>
      <el-upload v-loading="avatarUploading" ref="avatarUploader" class="avatar-uploader" action="" :http-request="onUploadAvatarIamge" :show-file-list="false" :on-success="onAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imgUrl" :src="imgUrl" class="edit-avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <el-form ref="editForm" status-icon :model="editForm">
        <el-form-item prop="userName" label="User Name" required>
          <el-input v-model="editForm.userName"></el-input>
        </el-form-item>
        <el-form-item prop="userDescription" label="User Description">
          <el-input v-model="editForm.userDescription"></el-input>
        </el-form-item>
      </el-form>
      <div class="edit-container-bottom">
        <el-button type="primary" @click="onEditSave">Save</el-button>
        <el-button @click="currentPanel='info'">Cancel</el-button>
      </div>
    </div>

    <div v-else-if="currentPanel='reset'" class="reset-container">
      <div class="edit-container-title">Reset Your Password</div>
      <el-divider></el-divider>
      <el-form ref="resetForm" status-icon :model="resetForm" :rules="resetRules">
        <el-form-item prop="oldPwd" label="Old Password">
          <el-input v-model="resetForm.oldPwd" show-password></el-input>
        </el-form-item>
        <el-form-item prop="newPwd" label="New Password">
          <el-input v-model="resetForm.newPwd" show-password></el-input>
        </el-form-item>
        <el-form-item prop="rePwd" label="Repeat Password">
          <el-input v-model="resetForm.rePwd" show-password></el-input>
        </el-form-item>
      </el-form>
      <div class="edit-container-bottom">
        <el-button type="primary" @click="onResetConfirm">Confirm</el-button>
        <el-button @click="currentPanel='info'">Cancel</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import APIs from '@/APIs'
import { ElMessage } from 'element-plus'
import Tools from '@/APIs/Tools'

@Options({
  data () {
    return {
      userName: '',
      userAvatar: '',
      userEmail: '',
      userTags: [],
      userDescription: '',
      currentPanel: 'info', // edit | reset
      imgUrl: '',
      avatarUploading: false,
      editForm: {
        userName: '',
        userDescription: ''
      },
      isSaving: false,
      resetForm: {
        oldPwd: '',
        newPwd: '',
        rePwd: ''
      },
      resetRules: {
        oldPwd: [
          { required: true, message: 'Old password can\'t be empty!', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: 'New password can\'t be empty!', trigger: 'blur' },
          { validator: this.pwdValidator, trigger: 'blur' }
        ],
        rePwd: [
          { required: true, message: 'Repeat password can\'t be empty!', trigger: 'blur' },
          { validator: this.repwdValidator, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    currentPanel (v) {
      if (v === 'info') {
        this.getUserInfo()
      } else if (v === 'edit') {
        this.imgUrl = this.userAvatar
        this.editForm.userName = this.userName
        this.editForm.userDescription = this.userDescription
      }
    }
  },
  computed: {
    userDes () {
      if (this.userDescription === '') return 'No description.'
      return this.userDescription
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    onDeleteAccountClicked () {
      this.$prompt('Please input your password.', 'Are you sure to delete your account?', {
        confirmButtonTet: 'Of caurse',
        cancelButtonText: 'No sure yet',
        type: 'warning',
        inputType: 'password',
        beforeClose: (action: string, instance: { inputValue: string }, done: () => void) => {
          if (action === 'confirm') {
            const value = instance.inputValue
            if (value && value !== '') {
              done()
            } else {
              ElMessage.error('You need to input your password to delete your account!')
            }
          } else done()
        }
      }).then((v:unknown) => {
        const res = v as { value:string }
        const pwd = res.value
        this.isSaving = true
        APIs.deleteUser(pwd).then(() => {
          ElMessage.success('Account deleted!')
          this.$router.push('/signin')
        }).catch((e) => {
          ElMessage.error('Can\'t delete your account.' + e)
        })
      }).catch((e:unknown) => { return e })
    },
    getUserInfo () {
      APIs.getUserInfo().then((v:unknown) => {
        const info = v as { userName:string, userAvatar:string, userEmail:string, userTags:Array<unknown>, userDescription:string}
        this.userName = info.userName
        this.userAvatar = info.userAvatar
        this.userEmail = info.userEmail
        this.userTags = info.userTags
        this.userDescription = info.userDescription
      }).catch((e) => {
        ElMessage.error('Can\'t get user info.' + e)
        this.$router.push('/signin')
      })
    },
    onAvatarSuccess (res:unknown, file: { raw: unknown }) {
      this.imgUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file: { type: string; size: number }) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const isFit = file.size / 1024 / 1024 < 2

      if (!isImg) {
        ElMessage.error('You can only upload jpeg/png as avatar')
      }
      if (!isFit) {
        ElMessage.error('You can only upload image which size is no more than 2M!')
      }
      return isImg && isFit
    },
    onEditSave () {
      this.$refs.editForm.validate((valid: boolean) => {
        if (valid) {
          this.isSaving = true
          APIs.setUserInfo(this.editForm.userName, this.imgUrl, this.editForm.userDescription).then(() => {
            ElMessage.success('Edit successfully!')
          }).catch((e) => {
            ElMessage.error('Can\'t edit.' + e)
            this.$router.push('/signin')
          }).then(() => {
            this.isSaving = false
            this.currentPanel = 'info'
          })
        } else {
          return false
        }
      })
    },
    onUploadAvatarIamge (params: { file:File }) {
      const file = {
        raw: params.file,
        base64: () => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(params.file)
            reader.onerror = e => reject(e)
            reader.onload = e => resolve(e.target?.result)
          })
        }
      }
      const handler = Tools.imagesUploadHandler(() => {
        this.avatarUploading = true
      }, () => {
        this.avatarUploading = false
      })
      handler(file, (url) => {
        this.imgUrl = url
        ElMessage.success('Upload done!')
      }, (err) => {
        ElMessage.error('Can\'t upload.' + err)
        this.imgUrl = this.userAvatar
      }, (x) => {
        console.log('Uploading: ' + x + '%')
      })
    },
    pwdValidator (rule: unknown, value: unknown, callback: () => void) {
      this.$refs.resetForm.validateField('rePwd')
      callback()
    },
    repwdValidator (rule: unknown, value: unknown, callback: (arg0: Error|undefined) => void) {
      if (value !== this.resetForm.newPwd) {
        callback(new Error('New Password and Repeat Password must be the same!'))
      } else callback(undefined)
    },
    onResetConfirm () {
      this.$refs.resetForm.validate((valid: boolean) => {
        if (valid) {
          this.$confirm('Are you sure to reset your password?', 'Warning', {
            confirmButtonText: 'Of caurse',
            cancelButtonText: 'No sure yet',
            type: 'warning'
          }).then(() => {
            this.isSaving = true
            APIs.resetPassword(this.resetForm.oldPwd, this.resetForm.newPwd).then(() => {
              ElMessage.success('Reset password successfully!')
              this.$router.push('/signin')
            }).catch((e) => {
              ElMessage.error('Can\'t reset password.' + e)
              this.isSaving = false
              this.currentPanel = 'info'
            })
          }).catch((e:unknown) => { return e })
        } else {
          return false
        }
      })
    }
  }
})
export default class PersonalInformation extends Vue {}
</script>

<style scoped>
.personal-information{
  padding: 20px;
  width: 100%;
  text-align: left;
}

.info-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-container-foot{
  margin-top: auto;

  display: flex;
  flex-direction: row;
}

.info-container-foot-reset{
  margin-left: auto;
}

.info-container-head{
  display: flex;
  flex-direction: row;
}

.info-container-head-right{
  margin-left: 15px;
}

.info-container-head-right-name{
  font-size: 14pt;
  margin-bottom: 10px;
}

.info-container-middle{
  margin-top: 15px;
}

.info-container-head-right-tag-list > *{
  margin-right: 5px;
}

.avatar-uploader{
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 64px;
  height: 64px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  line-height: 64px;
  text-align: center;
}

.edit-avatar {
  width: 64px;
  height: 64px;
  display: block;
}

.edit-container-title {
  font-size: 16pt;
  margin-bottom: 15px;
}

.edit-container-bottom {
  display: flex;
  flex-direction: row;
}

.edit-container-bottom > *{
  margin-right: 15px;
}
</style>
