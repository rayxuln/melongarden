import Moker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  return promiseHelper({
    members: Moker.userHelper.getUserNum(),
    posts: Moker.postHelper.getPostNum()
  }, 1000)
}
