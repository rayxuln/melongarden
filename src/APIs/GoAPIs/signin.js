import Tools from '../Tools'

export default function (user, pwd) {
  return Tools.goAPIPromiseHelper('api/v1/accounts/login', Tools.goAPIMakeOption('', 'POST', {
    id: user,
    password: pwd
  }), (v) => {
    // window.localStorage.setItem('token', v.token)
    Tools.setLoginTokenCookie(v.token)
    return {
    }
  }, '', {
    401: 'User or password is wrong!'
  })
}
