
import MokerAPIs from './MockerAPIs'

const APIs = MokerAPIs

class APIMidware {
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

  getUserMessageList (pageSize:number, pageNumber:number, filter:string) {
    return APIs.getUserMessageList(pageSize, pageNumber, filter)
  }
}

const ins = new APIMidware()

export default ins
