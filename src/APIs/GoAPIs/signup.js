import Tools from '../Tools'

export default function (user, pwd, userName, inviteCode) {
  return Tools.goAPIPromiseHelper('api/v1/accounts/register', Tools.goAPIMakeOption('', 'POST', {
    id: user,
    password: pwd,
    name: userName,
    invite_code: inviteCode
  }), (v) => {
    return {
    }
  }, '')
}
