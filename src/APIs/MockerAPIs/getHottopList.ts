import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  const hottopList = Mocker.postHelper.getHottopList()
  return promiseHelper({ hottopList }, 1000)
}
