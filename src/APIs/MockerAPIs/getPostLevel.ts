import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (postId:string, level:number):Promise<unknown> {
  let reject = false
  let reason = ''
  const post = Mocker.postHelper.getPostById(postId)
  const userId = Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())
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
      if (user !== null) {
        userName = user.userName
        userAvatarUrl = user.userAvatarUrl
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
        isYou: l.userId === Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())
      }
    }
  }
  return promiseHelper({ level: levelData }, 1000, reason, reject)
}
