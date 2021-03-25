
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
}

const ins = new APIMidware()

export default ins
