import Tools from '../Tools'

import Mocker, { promiseHelper } from './Mocker'

export default function (postId:string, content:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  const id = Mocker.userHelper.getLoginUserIdByToken(token)
  let reject = false
  let reason = ''
  let level = -1
  if (id === '') {
    reject = true
    reason = 'You are not login yet!'
  } else {
    const post = Mocker.postHelper.getPostById(postId)
    if (post === null) {
      reject = true
      reason = 'Post not found!'
    } else {
      const l = post.appendLevel(id, content)
      level = l.level
      Mocker.postHelper.sortPosts()
    }
  }
  return promiseHelper({ level }, 1000, reason, reject)
}
