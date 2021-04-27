import Tools from '../Tools'

import Mocker, { promiseHelper } from './Mocker'

export default function (user:string, pwd:string, userName:string, inviteCode:string):Promise<unknown> {
  let reject = false

  try {
    Mocker.userHelper.register(user, userName, pwd)
  } catch (e) {
    reject = true
  }

  return promiseHelper({}, 1000, 'Something is wrong!', reject)
}
