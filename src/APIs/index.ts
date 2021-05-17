
import MockerAPIs from './MockerAPIs'
import GoAPIs from './GoAPIs'

let APIs:Record<string, any> = GoAPIs

class APIMidware {
  checkAPI () {
    if (window.localStorage.getItem('debug')) {
      APIs = MockerAPIs
      console.log('using mocker APIs')
    }
  }

  getMembersAndPosts () {
    return APIs.getMembersAndPosts()
  }

  getPostList (pageSize:number, pageNumber:number, filter:string) {
    return APIs.getPostList(pageSize, pageNumber, filter)
  }

  checkToken () {
    return APIs.checkToken()
  }

  post (title:string, content:string) {
    return APIs.post(title, content)
  }

  getPostInfo (postId:string) {
    return APIs.getPostInfo(postId)
  }

  getPostLevelList (postId:string, pageSize:number, pageNumber:number, filter:string) {
    return APIs.getPostLevelList(postId, pageSize, pageNumber, filter)
  }

  reply (postId:string, content:string) {
    return APIs.reply(postId, content)
  }

  editPostLevel (postId:string, level:number, content:string) {
    return APIs.editPostLevel(postId, level, content)
  }

  getPostLevel (postId:string, level:number) {
    return APIs.getPostLevel(postId, level)
  }

  deletePostLevel (postId:string, level:number) {
    return APIs.deletePostLevel(postId, level)
  }

  likePostLevel (postId:string, level:number, like:number) {
    return APIs.likePostLevel(postId, level, like)
  }

  getPostLevelLikeInfo (postId:string, level:number) {
    return APIs.getPostLevelLikeInfo(postId, level)
  }

  getUserInfo () {
    return APIs.getUserInfo()
  }

  pinPost (postId:string, pin:boolean) {
    return APIs.pinPost(postId, pin)
  }

  getImagePostList (pageSize:number, pageNumber:number, filter:string) {
    return APIs.getImagePostList(pageSize, pageNumber, filter)
  }

  signin (user:string, pwd:string) {
    return APIs.signin(user, pwd)
  }

  signup (user:string, pwd:string, userName:string, inviteCode:string) {
    return APIs.signup(user, pwd, userName, inviteCode)
  }

  getTitleImage () {
    return APIs.getTitleImage()
  }

  logout () {
    return APIs.logout()
  }

  setUserInfo (userName:string, userAvatar:string, userDescription:string) {
    return APIs.setUserInfo(userName, userAvatar, userDescription)
  }

  resetPassword (oldPwd:string, newPwd:string) {
    return APIs.resetPassword(oldPwd, newPwd)
  }

  deleteUser (pwd:string) {
    return APIs.deleteUser(pwd)
  }

  checkNewMessage () {
    return APIs.checkNewMessage()
  }

  getUserMessageList (pageSize:number, pageNumber:number, filter:string, postPageSize:number) {
    return APIs.getUserMessageList(pageSize, pageNumber, filter, postPageSize)
  }

  getUserPostList (pageSize:number, pageNumber:number, filter:string, postPageSize:number) {
    return APIs.getUserPostList(pageSize, pageNumber, filter)
  }

  getUserPostLevelList (pageSize:number, pageNumber:number, filter:string, postPageSize:number) {
    return APIs.getUserPostLevelList(pageSize, pageNumber, filter, postPageSize)
  }

  getUserCheckInRecords () {
    return APIs.getUserCheckInRecords()
  }

  checkIn () {
    return APIs.checkIn()
  }

  imagesUploadHandler (start: () => void, finish: () => void) {
    if (APIs === GoAPIs) {
      return GoAPIs.imageUploadHandler(start, finish)
    }
    const forceFail = false
    return (blobInfo: { base64: () => unknown }, success: (a: string) => unknown, failure: (arg0: string, arg1: { remove: boolean }) => void, progress: (a: number) => unknown) => {
      start()
      const base64 = blobInfo.base64()
      const upload = (img:string) => {
        console.log('About to upload a image')
        let cnt = 10
        const int = setInterval(() => {
          if (cnt === 0) {
            success(img)
            finish()
            window.clearInterval(int)
          } else if (forceFail && cnt === 5) {
            failure('error force', { remove: true })
            finish()
            window.clearInterval(int)
          } else {
            cnt -= 1
            progress((10 - cnt) / 10 * 100)
          }
        }, 100)
      }
      if (typeof base64 === 'string') {
        upload('data:image/jpeg;base64,' + base64)
      } else {
        const p = base64 as Promise<unknown>
        p.then((v:unknown) => {
          upload(v as string)
        }).catch((e) => {
          console.error(e)
        })
      }
    }
  }
}

const ins = new APIMidware()

export default ins
