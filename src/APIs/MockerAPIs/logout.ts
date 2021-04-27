import Tools from '../Tools'
import { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  Tools.setLoginTokenCookie('')

  return promiseHelper({}, 1000, '', false)
}
