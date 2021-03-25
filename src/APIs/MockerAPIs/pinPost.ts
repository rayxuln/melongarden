import Tools from '../Tools'

import Mocker, { promiseHelper } from './Mocker'

export default function (postId:string, pin:boolean):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  const userId = Mocker.userHelper.getLoginUserIdByToken(token)
  let reject = false
  let reason = ''
  if (userId === '') {
    reject = true
    reason = 'You are not login yet!'
  } else {
    const post = Mocker.postHelper.getPostById(postId)
    if (post === null) {
      reject = true
      reason = 'Post not found!'
    } else {
      if (Mocker.postHelper.canPin(userId)) {
        if (pin) {
          Mocker.postHelper.pinPost(postId)
        } else {
          Mocker.postHelper.unpinPost(postId)
        }
      } else {
        reject = true
        reason = 'You can\'t pin or unpin.'
      }
    }
  }
  return promiseHelper({}, 1000, reason, reject)
}
