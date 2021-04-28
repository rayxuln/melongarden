import Tools from '../Tools'
import Mocker, { promiseHelper, Message } from './Mocker'

export default function (pageSize:number, pageNumber:number, filter:string):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  const msgList:Array<unknown> = []
  let totalNum = 0
  if (user !== null) {
    const res = user.getMessageList(pageSize, pageNumber, filter)
    const list = res[0] as Array<Message>
    totalNum = res[1] as number
    for (const m of list) {
      const tags = []
      if (!m.read) {
        tags.push({ type: 'danger', tag: 'New' })
      }
      msgList.push({
        title: m.title,
        content: Tools.extractTextFromHtml(m.content),
        url: `/post?post_id=${m.relativeUrl}`,
        date: Tools.getProperDateString(m.date),
        tags
      })
    }
  } else {
    reject = true
  }
  return promiseHelper({
    msgList,
    totalNum
  }, 1000, 'Invalid token', reject)
}
