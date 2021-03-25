import Tools from '../Tools'
import Mocker, { promiseHelper, PostLevel, UserType } from './Mocker'

export default function (postId:string, pageSize:number, pageNumber:number, filter:string):Promise<unknown> {
  const levels = []
  let levelNum = 0
  const post = Mocker.postHelper.getPostById(postId)
  // this is a user user
  const userId = Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())
  let isAdmin = false
  if (userId !== '') {
    const user = Mocker.userHelper.getUser(userId)
    isAdmin = user!.userType === UserType.ADMIN
  }
  if (post !== null) {
    const res = post.getLevels(pageSize, pageNumber, filter)
    const rawLevels = res[0] as Array<PostLevel>
    levelNum = res[1] as number
    for (const l of rawLevels) {
      const user = Mocker.userHelper.getUser(l.userId)
      let userName = '<UnkownUser>'
      let userAvatarUrl = ''
      if (user !== null) { // this is the layer user
        userName = user.userName
        userAvatarUrl = user.userAvatarUrl
      }
      levels.push({
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
        isYou: l.userId === Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())
      })
    }
  }
  return promiseHelper({ levels, levelNum }, 1000)
}
