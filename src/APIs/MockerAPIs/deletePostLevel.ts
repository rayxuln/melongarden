import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (postId:string, level:number):Promise<unknown> {
  let reject = false
  let reason = ''
  const user = Mocker.userHelper.getUserByToken(Tools.getLoginTokenCookie())
  let hasDeletePost = false
  if (user === null) {
    reject = true
    reason = 'Invalid token.'
  } else {
    const post = Mocker.postHelper.getPostById(postId)
    if (post === null) {
      reject = true
      reason = 'Can\'t find the post.'
    } else {
      if (level > 1) {
        const l = post.getLevel(level)
        if (l === null) {
          reject = true
          reason = 'Invalid level.'
        } else {
          if (!l.canUserDelete(user.userId)) {
            reject = true
            reason = 'You can\'t delete this level.'
          } else {
            post.deleteLevel(level)
          }
        }
      } else {
        if (!post.getFirstLevel().canUserDelete(user.userId)) {
          reject = true
          reason = 'You can\'t delete this post.'
        } else {
          hasDeletePost = true
          Mocker.postHelper.deletePost(postId)
        }
      }
    }
  }
  return promiseHelper({ hasDeletePost }, 1000, reason, reject)
}
