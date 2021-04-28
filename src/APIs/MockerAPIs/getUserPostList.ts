import Tools from '../Tools'
import Mocker, { promiseHelper, Post } from './Mocker'

export default function (pageSize:number, pageNumber:number, filter:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  const msgList:Array<unknown> = []
  let totalNum = 0
  if (user !== null) {
    const res = Mocker.pageList(Mocker.postHelper.getUserPostList(user.userId), pageSize, pageNumber, filter)
    const list = res[0] as Array<Post>
    totalNum = res[1] as number
    for (const m of list) {
      msgList.push({
        title: m.title,
        content: Tools.trimTextWithLength(Tools.extractTextFromHtml(m.postLevelList[0].content), 50),
        url: `/post?post_id=${m.postId}`,
        date: Tools.getProperDateString(m.postLevelList[0].date),
        tags: []
      })
    }
  } else {
    reject = true
  }
  return promiseHelper({
    dataList: msgList,
    totalNum
  }, 1000, 'Invalid token', reject)
}
