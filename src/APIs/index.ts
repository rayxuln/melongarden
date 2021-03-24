
import getMembersAndPosts from './getMembersAndPosts'
import getPostList from './getPostList'
import checkToken from './checkToken'
import post from './post'
import getPostInfo from './getPostInfo'
import getPostLevelList from './getPostLevelList'
import reply from './reply'

class APIMidware {
  getMembersAndPosts () {
    return getMembersAndPosts()
  }

  getPostList (pageSize:number, pageNumber:number, filter:string) {
    return getPostList(pageSize, pageNumber, filter)
  }

  checkToken () {
    return checkToken()
  }

  post (title:string, content:string) {
    return post(title, content)
  }

  getPostInfo (postId:string) {
    return getPostInfo(postId)
  }

  getPostLevelList (postId:string, pageSize:number, pageNumber:number, filter:string) {
    return getPostLevelList(postId, pageSize, pageNumber, filter)
  }

  reply (postId:string, content:string) {
    return reply(postId, content)
  }
}

const ins = new APIMidware()

export default ins
