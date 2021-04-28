import Tools from '../Tools'
import Mocker, { promiseHelper } from './Mocker'

export default function (pageSize:number, pageNumber:number, filter:string, postPageSize:number):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  const msgList:Array<unknown> = []
  let totalNum = 0
  let page = 1
  if (user !== null) {
    const res = Mocker.pageList(Mocker.postHelper.getUserPostLevelList(user.userId), pageSize, pageNumber, filter)
    const list = res[0] as Array<unknown>
    totalNum = res[1] as number
    for (const l of list) {
      const m = l as { title:string, content:string, postId:string, date:Date, level:number }
      page = Math.floor(m.level / postPageSize) + 1
      msgList.push({
        title: m.title,
        content: Tools.trimTextWithLength(Tools.extractTextFromHtml(m.content), 50),
        url: `/post?page=${page}&post_id=${m.postId}#L${m.level}`,
        date: Tools.getProperDateString(m.date),
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
