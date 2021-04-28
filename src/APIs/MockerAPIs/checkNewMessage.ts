import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let hasMsg = false
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    hasMsg = user.hasNewMessage()
  } else {
    reject = true
  }
  return promiseHelper({
    hasMsg
  }, 1000, 'Invalid token', reject)
}
