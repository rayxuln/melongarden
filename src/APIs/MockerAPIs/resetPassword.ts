import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (oldPwd:string, newPwd:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  let reason = ''
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    if (user.pwd === oldPwd) {
      user.pwd = newPwd
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
