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
      levelData = {
        hasLike: l.hasUserLike(userId),
        likeNum: l.likeNum,
        dislikeNum: l.disLikeNum
      }
    }
  }
  return promiseHelper(levelData, 100, reason, reject)
}
