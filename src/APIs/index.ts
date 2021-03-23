
import getMembersAndPosts from './getMembersAndPosts'
import getPostList from './getPostList'
import checkToken from './checkToken'

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

  getLoginTokenCookie () {
    const cookie = decodeURIComponent(document.cookie)
    const ca = cookie.split(';')
    for (const c of ca) {
      if (c.indexOf('token=') === 0) {
        return c.substring('token='.length, c.length)
      }
    }
    return ''
  }
}

const ins = new APIMidware()

export default ins
