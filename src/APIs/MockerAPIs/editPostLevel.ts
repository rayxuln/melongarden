import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (postId:string, level:number, content:string):Promise<unknown> {
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
        if (!l.canUserEdit(user.userId)) {
          reject = true
          reason = 'You can\'t edit this level.'
        } else {
          l.content = content
          l.isEdited = true
          l.date = new Date()
        }
      }
    }
  }
  return promiseHelper({ }, 1000, reason, reject)
}
