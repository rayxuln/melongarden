
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
}

const ins = new APIMidware()

export default ins
