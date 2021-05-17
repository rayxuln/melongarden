import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  let records:Array<boolean> = []
  let hasCheckedIn = false
  if (user !== null) {
    records = [...user.userCheckInRecords]
    hasCheckedIn = user.hasCheckedIn()
  } else {
    reject = true
  }
  return promiseHelper({
    month: (new Date()).getMonth() + 1,
    records,
    hasCheckedIn
  }, 100, 'Invalid token', reject)
}
