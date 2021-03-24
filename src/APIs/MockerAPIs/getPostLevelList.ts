import Tools from '../Tools'
import Mocker, { promiseHelper, PostLevel } from './Mocker'

export default function (postId:string, pageSize:number, pageNumber:number, filter:string):Promise<unknown> {
  const levels = []
  let levelNum = 0
  const post = Mocker.postHelper.getPostById(postId)
  if (post !== null) {
    const res = post.getLevels(pageSize, pageNumber, filter)
    const rawLevels = res[0] as Array<PostLevel>
    levelNum = res[1] as number
    for (const l of rawLevels) {
      const user = Mocker.userHelper.getUser(l.userId)
      let userName = '<UnkownUser>'
      let userAvatarUrl = ''
      if (user !== null) {
        userName = user.userName
        userAvatarUrl = user.userAvatarUrl
      }
      levels.push({
        userAvatarUrl,
        userName,
        content: l.content,
        level: l.level,
        date: Tools.getProperDateString(l.date),
        isPoster: post.getFirstLevel().userId === l.userId,
        isYou: l.userId === Mocker.userHelper.getLoginUserIdByToken(Tools.getLoginTokenCookie())
      })
    }
  }
  return promiseHelper({ levels, levelNum }, 1000)
}
