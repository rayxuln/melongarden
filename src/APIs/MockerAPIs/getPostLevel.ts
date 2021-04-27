import Tools from '../Tools'
import Mocker, { promiseHelper, UserType } from './Mocker'

export default function (postId:string, level:number):Promise<unknown> {
  let reject = false
  let reason = ''
  const post = Mocker.postHelper.getPostById(postId)
  const userId = Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())
  let isAdmin = false
  if (userId !== '') {
    const user = Mocker.userHelper.getUser(userId)
    isAdmin = user!.userType === UserType.ADMIN
  }
  let levelData = {}
  if (post === null) {
    reject = true
    reason = 'Can\'t find the post.'
  } else {
    const l = post.getLevel(level)
    if (l === null) {
      reject = true
      reason = 'Invalid level.'
    } else {
      const user = Mocker.userHelper.getUser(l.userId)
      let userName = '<UnkownUser>'
      let userAvatarUrl = ''
      const tags = []
      if (user !== null) {
        userName = user.userName
        userAvatarUrl = user.userAvatarUrl
        tags.push({ type: '', tag: user.userLevel })
        if (user.userType === UserType.ADMIN) {
          tags.push({ type: 'danger', tag: 'Admin' })
        }
      }
      if (post.getFirstLevel().userId === l.userId) {
        tags.push({ type: 'warning', tag: 'Poster' })
      }
      if (l.userId === Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())) {
        tags.push({ type: '', tag: 'You' })
      }
      levelData = {
        userAvatarUrl,
        userName,
        content: l.content,
        level: l.level,
        date: Tools.getProperDateString(l.date),
        hasEdited: l.isEdited,
        hasLike: l.hasUserLike(userId),
        likeNum: l.likeNum,
        dislikeNum: l.disLikeNum,
        isPoster: post.getFirstLevel().userId === l.userId,
        isLoading: false,
        isAdmin,
        isPinned: post.isPinned,
        isYou: l.userId === Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie()),
        hasDeleted: l.deleted,
        userTags: tags
      }
    }
  }
  return promiseHelper({ level: levelData }, 1000, reason, reject)
}
