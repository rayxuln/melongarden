import Tools from '../Tools'

import Mocker, { promiseHelper } from './Mocker'

export default function (title:string, content:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  const id = Mocker.userHelper.getLoginUserIdByToken(token)
  let reject = false
  if (id === '') {
    reject = true
  } else {
    Mocker.postHelper.post(id, title, content)
  }
  return promiseHelper({}, 1000, 'You are not login yet!', reject)
}
