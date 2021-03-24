import Mocker, { promiseHelper } from './Mocker'

export default function ():Promise<unknown> {
  return promiseHelper({
    members: Mocker.userHelper.getUserNum(),
    posts: Mocker.postHelper.getPostNum()
  }, 1000)
}
