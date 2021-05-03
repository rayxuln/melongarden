import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let userName = ''
  let userAvatar = ''
  let userEmail = ''
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    userName = user.userName
    userAvatar = user.userAvatarUrl
    userEmail = user.userEmail
  } else {
    reject = true
  }
  return promiseHelper({
    userName,
    userAvatar,
    userEmail
  }, 1000, 'Invalid token', reject)
}
