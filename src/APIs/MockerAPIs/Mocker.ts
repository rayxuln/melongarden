
import Tools from '../Tools'

const avatarUrls = [
  'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
]

let userIdCount = 10086
let userTokenCount = 100
let postIdCount = 233

export const UserType = {
  NORMAL: 0,
  ADMIN: 1
}

class User {
  userId = ''
  userEmail = ''
  userName = '<UnknownUserName>'
  userAvatarUrl = ''
  userType = UserType.NORMAL
  userDescription = ''
  pwd = ''

  constructor (email:string, name:string, avatar:string, type:number, description:string, pwd:string) {
    this.userId = `${userIdCount++}`
    this.userEmail = email
    this.userName = name
    this.userAvatarUrl = avatar
    this.userType = type
    this.userDescription = description
    this.pwd = pwd
  }
}

class UserHelper {
  userList:Array<User> = []

  loginUserDictionary:Record<string, string> = {}

  register (email:string, name:string, pwd:string, type:number = UserType.NORMAL) {
    this.userList.push(new User(email, name, avatarUrls[userIdCount % 2], type, '', pwd))
  }

  login (email:string, pwd:string) {
    for (const i of this.userList) {
      if (i.userEmail === email) {
        if (i.pwd !== pwd) throw new Error('Wrong password.')
        console.log(`${email}(${i.userName}) has login.`)
        this.loginUserDictionary[i.userId] = `${userTokenCount++}`
        return this.loginUserDictionary[i.userId]
      }
    }
    throw new Error(`Unregister user ${email}`)
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

  getUserAvatarById (id:string) {
    const user = this.getUser(id)
    if (user) {
      return user.userAvatarUrl
    }
    return ''
  }

  getUserTags (userId:string) {
    const user = this.getUser(userId)
    return user!.userType === UserType.ADMIN ? [{ type: 'warning', tag: 'Admin' }] : []
  }
}

export class PostLevel {
  userId = ''
  content = ''
  date:Date
  level = -1
  deleted = false
  isEdited = false
  likeNum = 0
  disLikeNum = 0

  likeOrDislikeUserList:Record<string, number> = {} // 1 = like, 2 = dislike

  constructor (userId:string, content:string, level:number) {
    this.date = new Date()
    this.userId = userId
    this.content = content
    this.level = level
  }

  contain (key:string):boolean {
    return this.content.includes(key)
  }

  canUserEdit (userId:string):boolean {
    return this.userId === userId
  }

  canUserDelete (userId:string):boolean {
    if (this.userId === userId) return true
    const user = m.userHelper.getUser(userId)
    if (user && user.userType === UserType.ADMIN) return true
    return false
  }

  like (userId:string):void {
    if (this.likeOrDislikeUserList[userId] === 1) {
      this.likeNum -= 1
      delete this.likeOrDislikeUserList[userId]
    } else if (this.likeOrDislikeUserList[userId] === 2) {
      this.likeNum += 1
      this.disLikeNum -= 1
      this.likeOrDislikeUserList[userId] = 1
    } else {
      this.likeNum += 1
      this.likeOrDislikeUserList[userId] = 1
    }
  }

  dislike (userId:string):void {
    if (this.likeOrDislikeUserList[userId] === 2) {
      this.disLikeNum -= 1
      delete this.likeOrDislikeUserList[userId]
    } else if (this.likeOrDislikeUserList[userId] === 1) {
      this.disLikeNum += 1
      this.likeNum -= 1
      this.likeOrDislikeUserList[userId] = 2
    } else {
      this.disLikeNum += 1
      this.likeOrDislikeUserList[userId] = 2
    }
  }

  hasUserLike (userId:string):number {
    return this.likeOrDislikeUserList[userId] || 0
  }

  hasImages ():boolean {
    return this.content.includes('<img')
  }

  getImages ():Array<string> {
    return Tools.getImagesInPost(this.content, -1)
  }

  getImage ():string {
    const res = Tools.getImagesInPost(this.content, 1)
    if (res.length > 0) return res[0]
    return ''
  }
}

type NullablePostLevel = PostLevel | null

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

  getLevels (pageSize:number, pageNumber:number, key:string):Array<unknown> {
    if (pageSize <= 0) return [[], 0]
    let postLevelList = []
    if (key === '') {
      postLevelList = this.postLevelList
    } else {
      for (const l of this.postLevelList) {
        if (l.deleted) continue
        if (l.contain(key)) {
          postLevelList.push(l)
        }
      }
    }
    const start = Math.max(0, (pageNumber - 1) * pageSize)
    const end = Math.min(postLevelList.length, pageNumber * pageSize)
    const res = []
    for (let i = start; i < end; ++i) {
      res.push(postLevelList[i])
    }
    return [res, postLevelList.length]
  }

  getLastLevel ():PostLevel {
    return this.postLevelList[this.postLevelList.length - 1]
  }

  getFirstLevel ():PostLevel {
    return this.postLevelList[0]
  }

  getLevel (l:number):NullablePostLevel {
    l -= 1
    if (l < 0 || l >= this.postLevelList.length) return null
    return this.postLevelList[l]
  }

  // updateLevelIndex ():void {
  //   let cnt = 1
  //   for (const l of this.postLevelList) {
  //     l.level = cnt++
  //   }
  // }

  deleteLevel (l:number):void {
    // this.postLevelList.splice(l, 1)
    // this.updateLevelIndex()
    this.postLevelList[l - 1].deleted = true
  }

  getReplyNum ():number {
    return this.postLevelList.length
  }

  contain (key:string):boolean {
    if (key === '') return true
    if (this.title.includes(key)) return true
    for (const pl of this.postLevelList) {
      if (pl.deleted) continue
      if (pl.contain(key)) return true
    }
    return false
  }

  hasEdited ():boolean {
    return this.getFirstLevel().isEdited
  }

  hasImage ():boolean {
    for (const l of this.postLevelList) {
      if (l.deleted) continue
      if (l.hasImages()) return true
    }
    return false
  }

  getPreviewImage ():string {
    for (const l of this.postLevelList) {
      if (l.deleted) continue
      if (l.hasImages()) return l.getImage()
    }
    return ''
  }

  getAllImges ():Array<string> {
    const res = []
    for (const l of this.postLevelList) {
      if (l.deleted) continue
      res.push(...l.getImages())
    }
    return res
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

  unpinPost (postId:string) {
    const post = this.getPostById(postId)
    if (post === null) throw new Error('postId is invalid')
    if (post.isPinned) {
      post.isPinned = false
      this.sortPosts()
    }
  }

  canPin (userId:string) {
    const user = m.userHelper.getUser(userId)
    if (user && user.userType === UserType.ADMIN) return true
    return false
  }

  deletePost (postId:string) {
    for (let i = 0; i < this.postList.length; ++i) {
      if (this.postList[i].postId === postId) {
        this.postList.splice(i, 1)
      }
    }
  }

  getPosts (pageSize:number, pageNumber:number, key:string, needImg = false) {
    if (pageSize <= 0) return [[], 0]
    let postList = []
    if (needImg) {
      for (const p of this.postList) {
        if (p.contain(key) && p.hasImage()) postList.push(p)
      }
    } else {
      if (key === '') {
        postList = this.postList
      } else {
        for (const p of this.postList) {
          if (p.contain(key)) postList.push(p)
        }
      }
    }
    const start = Math.max(0, (pageNumber - 1) * pageSize)
    const end = Math.min(postList.length, pageNumber * pageSize)
    const res = []
    for (let i = start; i < end; ++i) {
      res.push(postList[i])
    }
    return [res, postList.length]
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

  getUserPostNum (userId:string) {
    let res = 0
    for (const post of this.postList) {
      if (post.getFirstLevel().userId === userId) {
        res += 1
      }
    }
    return res
  }

  getUserReplyNum (userId:string) {
    let res = 0
    for (const post of this.postList) {
      for (const level of post.postLevelList) {
        if (level.level !== 1 && level.userId === userId) {
          res += 1
        }
      }
    }
    return res
  }
}

class Mocker {
  loginUserToken = ''

  userHelper:UserHelper = new UserHelper()
  postHelper:PostHelper = new PostHelper()

  constructor () {
    this.userHelper.register('dogman', 'ADogMan', '123')
    this.userHelper.register('catman', 'ACatMan', '123')
    this.userHelper.register('admin', 'AdminMan', '123', UserType.ADMIN)

    this.postTest()
  }

  postTest () {
    let p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'Welcome again everyone!1', 'Hi every one, this msg is from the Mocker!!!1')
    p.postLevelList[0].date = new Date('1995-12-17')

    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?1')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?2')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?3')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?4')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?5')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?6')
    p.appendLevel(this.userHelper.getUserIdByName('ACatMan'), 'You are a fool, aren\'t you?7')

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'Welcome again everyone!2', 'Hi every one, this msg is from the Mocker!!!2')
    p.postLevelList[0].date = new Date('2021-2-17')

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'Welcome again everyone!3', 'Hi every one, this msg is from the Mocker!!!3')
    p.postLevelList[0].date = new Date('2020-3-8')

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'It should be pinned1', 'Hi every one, this msg is from the Mocker!!!4')
    p.postLevelList[0].date = new Date('2019-4-1')
    this.postHelper.pinPost(p.postId)
    p.getFirstLevel().like(this.userHelper.getUserIdByName('ADogMan'))
    p.getFirstLevel().like(this.userHelper.getUserIdByName('ACatMan'))

    p = this.postHelper.post(this.userHelper.getUserIdByName('ADogMan'), 'It should be pinned2', 'Hi every one, this msg is from the Mocker!!!4')
    p.postLevelList[0].date = new Date('2019-4-2')
    this.postHelper.pinPost(p.postId)
    p.getFirstLevel().like(this.userHelper.getUserIdByName('ADogMan'))

    p = this.postHelper.post(this.userHelper.getUserIdByName('AdminMan'), 'Admin POST!!!', 'Hi everyone, how do you do?')
    p.postLevelList[0].date = new Date('2018-5-26')
    this.postHelper.pinPost(p.postId)
    p.getFirstLevel().like(this.userHelper.getUserIdByName('AdminMan'))

    // this.postHelper.sortPosts()
  }
}

const m:Mocker = new Mocker()

export default m

export function promiseHelper (v:unknown, timeout = -1, f = 'Reject for noreson', isReject = false):Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (isReject) {
      if (timeout <= 0) {
        reject(new Error(f))
      } else {
        setTimeout(() => reject(new Error(f)), timeout)
      }
    } else {
      if (timeout <= 0) {
        resolve(v)
      } else {
        setTimeout(() => resolve(v), timeout)
      }
    }
  })
}
