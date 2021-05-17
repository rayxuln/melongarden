import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  if (user !== null) {
    user.checkIn()
  } else {
    reject = true
  }
  return promiseHelper({
  }, 100, 'Invalid token', reject)
}
