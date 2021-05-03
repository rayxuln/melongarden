import Tools from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/me/account', Tools.goAPIEmptyGetOption(), (v) => {
    return {
      userName: v.name,
      userEmail: v.id,
      userAvatar: v.avatar
    }
  }, '')
}
