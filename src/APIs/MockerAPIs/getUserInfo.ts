import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  let userName = 'Unkwown'
  let userAvatar = ''
  let userEmail = ''
  let userPostNum = 0
  let userReplyNum = 0
  let userTags:Array<unknown> = []
  if (user !== null) {
    userName = user.userName
    userAvatar = user.userAvatarUrl
    userEmail = user.userEmail
    userPostNum = Mocker.postHelper.getUserPostNum(user.userId)
    userReplyNum = Mocker.postHelper.getUserReplyNum(user.userId)
    userTags = Mocker.userHelper.getUserTags(user.userId)
  } else {
    reject = true
  }
  return promiseHelper({
    userPostNum,
    userReplyNum,
    userName,
    userAvatar,
    userEmail,
    userTags
  }, 100, 'Invalid token', reject)
}
