import Moker, { promiseHelper } from './Mocker'

export default function (token:string):Promise<unknown> {
  const hasLogin = Moker.userHelper.getLoginUserIdByToken(token) !== ''
  let userName = ''
  let userAvatar = ''
  if (hasLogin) {
    const user = Moker.userHelper.getUserByToken(token)
    userName = user!.userName
    userAvatar = user!.userAvatarUrl
  }
  return promiseHelper({
    userName,
    userAvatar,
    hasLogin
  }, 1000)
}
