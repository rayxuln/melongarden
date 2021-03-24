
let userIdCount = 0
let userTokenCount = 100
let postIdCount = 233

class User {
  userId = ''
  userName = '<UnknownUserName>'
  userAvatarUrl = ''

  constructor (name:string, avatar:string) {
    this.userId = `${userIdCount++}`
    this.userName = name
    this.userAvatarUrl = avatar
  }
}

class UserHelper {
  userList:Array<User> = []

  loginUserDictionary:Record<string, string> = {}

  register (name:string, avatar:string) {
    this.userList.push(new User(name, avatar))
  }

  login (id:string) {
    for (const i of this.userList) {
      if (i.userId === id) {
        console.log(`${id}(${i.userName}) has login.`)
        this.loginUserDictionary[id] = `${userTokenCount++}`
        return this.loginUserDictionary[id]
      }
    }
    throw new Error(`Unregister user id ${id}`)
  }

  getUserIdByName (name:string) {
    for (const i of this.userList) {
      if (i.userName === name) {
        return i.userId
      }
    }
    return '<UnknownUserId>'
  }

  getLoginUserIdByToken (token:string) {
    for (const id in this.loginUserDictionary) {
      if (this.loginUserDictionary[id] === token) {
        return id
      }
    }
    return ''
  }

  logout (token:string) {
    const id = this.getLoginUserIdByToken(token)
    if (id !== '') {
      delete this.loginUserDictionary[id]
    }
  }

  getUser (id:string) {
    for (const i of this.userList) {
      if (i.userId === id) {
        return i
      }
    }
    return null
  }

  getUserByToken (token:string) {
    return this.getUser(this.getLoginUserIdByToken(token))
  }

  getUserNum () {
    return this.userList.length
  }

  getUserNameById (id:string) {
    const user = this.getUser(id)
    if (user) {
      return user.userName
    }
    return '<UnkwownUser>'
  }
}

class PostLevel {
  userId = ''
  content = ''
  date:Date
  level = -1
  isEdited = false

  constructor (userId:string, content:string, level:number) {
    this.date = new Date()
    this.userId = userId
    this.content = content
    this.level = level
  }
}

export class Post {
  postLevelList:Array<PostLevel> = []
  title = ''
  postId = ''
  isPinned = false

  constructor (title:string) {
    this.title = title
    this.postId = `${postIdCount++}`
  }

  clearLevels ():void {
    this.postLevelList = []
  }

  appendLevel (posterId:string, content:string):void {
    const l = new PostLevel(posterId, content, this.postLevelList.length + 1)
    this.postLevelList.push(l)
  }

  getPoster ():string {
    if (this.postLevelList.length === 0) return ''
    return this.postLevelList[0].userId
  }

  getLastReplior ():string {
    if (this.postLevelList.length === 0) return ''
    return this.postLevelList[this.postLevelList.length - 1].userId
  }

  getLevels (pageSize:number, pageNumber:number):Array<PostLevel> {
    if (pageSize <= 0) return []
    const start = Math.max(0, (pageNumber - 1) * pageSize)
    const end = Math.min(this.postLevelList.length, pageNumber * pageSize)
    const res = []
    for (let i = start; i < end; ++i) {
      res.push(this.postLevelList[i])
    }
    return res
  }

  getLastLevel ():PostLevel {
    return this.postLevelList[this.postLevelList.length - 1]
  }

  getFirstLevel ():PostLevel {
    return this.postLevelList[0]
  }

  getReplyNum ():number {
    return this.postLevelList.length
  }
}

class PostHelper {
  postList:Array<Post> = []

  post (posterId:string, title:string, content:string) {
    const p = new Post(title)
    p.appendLevel(posterId, content)
    let hasInserted = false
    for (let i = 0; i < this.postList.length; ++i) {
      if (!this.postList[i].isPinned && p.getLastLevel().date >= this.postList[i].getLastLevel().date) {
        this.postList.splice(i, 0, p)
        hasInserted = true
        break
      }
    }
    if (!hasInserted) {
      this.postList.push(p)
    }
    return p
  }

  pinPost (postId:string) {
    const post = this.getPostById(postId)
    if (post === null) throw new Error('postId is invalid')
    if (!post.isPinned) {
      post.isPinned = true
      this.sortPosts()
    }
  }

  getPosts (pageSize:number, pageNumber:number) {
    if (pageSize <= 0) return []
    const start = Math.max(0, (pageNumber - 1) * pageSize)
    const end = Math.min(this.postList.length, pageNumber * pageSize)
    const res = []
    for (let i = start; i < end; ++i) {
      res.push(this.postList[i])
    }
    return res
  }

  getPostNum () {
    return this.postList.length
  }

  sortPosts () {
    this.postList.sort((a:Post, b:Post) => {
      if (a.isPinned === b.isPinned) {
        return b.getLastLevel().date.getTime() - a.getLastLevel().date.getTime()
      }
      return a.isPinned ? -1 : 1
    })
  }

  getPostById (postId:string) {
    for (const p of this.postList) {
      if (p.postId === postId) {
        return p
      }
    }
    return null
  }
}

class Mocker {
  loginUserToken = ''

  userHelper:UserHelper = new UserHelper()
  postHelper:PostHelper = new PostHelper()

  constructor () {
    this.userHelper.register('ADogMan', 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png')
    this.userHelper.register('ACatMan', 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

    this.postTest()
  }

  setLoginTokenCookie (token:string) {
    document.cookie = `token=${token}; path=/`
  }

  loginTestUser () {
    this.loginUserToken = this.userHelper.login(this.userHelper.getUserIdByName('ACatMan'))
    this.setLoginTokenCookie(this.loginUserToken)
  }

  postTest () {
    let p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'Welcome again everyone!1', 'Hi every one, this msg is from the Mocker!!!1')
    p.postLevelList[0].date = new Date('1995-12-17')

    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?')

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'Welcome again everyone!2', 'Hi every one, this msg is from the Mocker!!!2')
    p.postLevelList[0].date = new Date('2021-2-17')

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'Welcome again everyone!3', 'Hi every one, this msg is from the Mocker!!!3')
    p.postLevelList[0].date = new Date('2020-3-8')

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'It should be pinned1', 'Hi every one, this msg is from the Mocker!!!4')
    p.postLevelList[0].date = new Date('2019-4-1')
    this.postHelper.pinPost(p.postId)

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'It should be pinned2', 'Hi every one, this msg is from the Mocker!!!4')
    p.postLevelList[0].date = new Date('2019-4-2')
    this.postHelper.pinPost(p.postId)

    // this.postHelper.sortPosts()
  }
}

const m:Mocker = new Mocker()

export default m

export function promiseHelper (v:unknown, timeout = -1, f = 'Reject for noreson', isReject = false):Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (isReject) {
      reject(new Error(f))
    } else {
      if (timeout <= 0) {
        resolve(v)
      } else {
        setTimeout(() => resolve(v), timeout)
      }
    }
  })
}
