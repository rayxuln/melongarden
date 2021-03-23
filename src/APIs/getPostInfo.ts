import Moker, { promiseHelper } from './Mocker'

export default function (postId:string):Promise<unknown> {
  let reject = false
  const p = Moker.postHelper.getPostById(postId)
  let levelNum = 0
  let title = ''
  if (p === null) {
    reject = true
  } else {
    levelNum = p.postLevelList.length
    title = p.title
  }
  return promiseHelper({ levelNum, title }, 1000, 'Post not exists!', reject)
}
