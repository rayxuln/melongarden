import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (postId:string, level:number, like:number):Promise<unknown> {
  let reject = false
  let reason = ''
  const user = Mocker.userHelper.getUserByToken(Tools.getLoginTokenCookie())
  if (user === null) {
    reject = true
    reason = 'Invalid token.'
  } else {
    const post = Mocker.postHelper.getPostById(postId)
    if (post === null) {
      reject = true
      reason = 'Can\'t find the post.'
    } else {
      const l = post.getLevel(level)
      if (l === null) {
        reject = true
        reason = 'Invalid level.'
      } else {
        if (like === 1) {
          l.like(user.userId)
        } else if (like === 2) {
          l.dislike(user.userId)
        } else {
          reject = true
          reason = 'Invalid like type.'
        }
      }
    }
  }
  return promiseHelper({ }, 100, reason, reject)
}
