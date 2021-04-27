import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (userName:string, userAvatar:string, userDescription:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    user.userName = userName
    user.userAvatarUrl = userAvatar
    user.userDescription = userDescription
  } else {
    reject = true
  }
  return promiseHelper({}, 1000, 'Invalid token', reject)
}
