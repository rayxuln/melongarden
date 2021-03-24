import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let userName = ''
  let userAvatar = ''
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    userName = user!.userName
    userAvatar = user!.userAvatarUrl
  } else {
    reject = true
  }
  return promiseHelper({
    userName,
    userAvatar
  }, 1000, 'Invalid token', reject)
}
