
import getMembersAndPosts from './getMembersAndPosts'
import getPostList from './getPostList'
import checkToken from './checkToken'
import post from './post'

class APIMidware {
  getMembersAndPosts () {
    return getMembersAndPosts()
  }

  getPostList (pageSize:number, pageNumber:number) {
    return getPostList(pageSize, pageNumber)
  }

  checkToken (token:string) {
    return checkToken(token)
  }

  post (title:string, content:string) {
    return post(title, content)
  }
}

const ins = new APIMidware()

export default ins
