import Tools from '../Tools'
import getUserInfo from './getUserInfo.js'

export default function (userName, userAvatar, userDescription) {
  return getUserInfo().then(v => {
    return Tools.goAPIPromiseHelper('api/v1/accounts', Tools.goAPIMakeOption('', 'PUT', {
      id: v.userEmail,
      avatar: userAvatar,
      description: userDescription,
      gender: 1,
      name: userName
    }), (v) => {
      return {
      }
    }, '')
  })
}
