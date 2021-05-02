import Tools from '../Tools'

export default function () {
  Tools.setLoginTokenCookie('')
  return new Promise((resolve) => resolve({}))
}
