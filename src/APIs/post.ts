import Tools from './Tools'

import Moker, { promiseHelper } from './Mocker'

export default function (title:string, content:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  const id = Moker.userHelper.getLoginUserIdByToken(token)
  let reject = false
  if (id === '') {
    reject = true
  } else {
    Moker.postHelper.post(id, title, content)
  }
  return promiseHelper({}, 1000, 'You are not login yet!', reject)
}
