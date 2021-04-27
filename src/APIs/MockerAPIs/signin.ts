import Tools from '../Tools'

import Mocker, { promiseHelper } from './Mocker'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (user:string, pwd:string):Promise<unknown> {
  let token = ''
  let reject = false

  try {
    token = Mocker.userHelper.login(user, pwd)
  } catch (e) {
    reject = true
  }

  Tools.setLoginTokenCookie(token)

  return promiseHelper({}, 1000, 'Email or password is wrong!', reject)
}
