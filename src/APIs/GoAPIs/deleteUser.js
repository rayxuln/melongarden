import Tools from '../Tools'
import getUserInfo from './getUserInfo.js'
import signin from './signin.js'

export default function (pwd) {
  let userName = ''
  return getUserInfo().then(v => {
    userName = v.userEmail
    return signin(userName, pwd)
  }).then(v => {
    return Tools.goAPIPromiseHelper(`api/v1/accounts/${userName}`, Tools.goAPIMakeOption('', 'DELETE', {
    }), (v) => {
      return {}
    }, '')
  })
}
