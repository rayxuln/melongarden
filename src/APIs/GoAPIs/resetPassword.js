import Tools from '../Tools'
import getUserInfo from './getUserInfo.js'

export default function (oldPwd, newPwd) {
  return Tools.goAPIPromiseHelper('api/v1/accounts/reset-password', Tools.goAPIMakeOption('', 'POST', {
    newPassword: newPwd,
    oldPassword: oldPwd
  }), (v) => {
    return {
    }
  }, '')
}
