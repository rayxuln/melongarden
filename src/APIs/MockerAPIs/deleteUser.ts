import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (pwd:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  let reason = ''
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    if (user.pwd === pwd) {
      Mocker.userHelper.unregister(user.userId)
    } else {
      reject = true
      reason = 'Wrong password'
    }
  } else {
    reject = true
    reason = 'Invalid token'
  }
  return promiseHelper({}, 1000, reason, reject)
}
