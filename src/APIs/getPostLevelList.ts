import Tools from './Tools'
import Moker, { promiseHelper } from './Mocker'

export default function (postId:string, pageSize:number, pageNumber:number):Promise<unknown> {
  const levels = []
  const post = Moker.postHelper.getPostById(postId)
  if (post !== null) {
    const rawLevels = post.getLevels(pageSize, pageNumber)
    for (const l of rawLevels) {
      const user = Moker.userHelper.getUser(l.userId)
      let userName = '<UnkownUser>'
      if (user !== null) userName = user.userName
      levels.push({
        userAvatarUrl: '',
        userName,
        content: l.content,
        level: l.level,
        date: Tools.getProperDateString(l.date),
        isPoster: post.getFirstLevel().userId === l.userId
      })
    }
  }
  return promiseHelper(levels, 1000)
}
