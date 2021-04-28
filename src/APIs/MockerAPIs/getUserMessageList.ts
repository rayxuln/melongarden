import Tools from '../Tools'
import Mocker, { promiseHelper, Message } from './Mocker'

export default function (pageSize:number, pageNumber:number, filter:string, postPageSize:number):Promise<unknown> {
  const token = Tools.getLoginTokenCookie()
  let reject = false
  const user = Mocker.userHelper.getUserByToken(token)
  const msgList:Array<unknown> = []
  let totalNum = 0
  if (user !== null) {
    const res = user.getMessageList(pageSize, pageNumber, filter)
    const list = res[0] as Array<Message>
    let page = 1
    totalNum = res[1] as number
    for (const m of list) {
      const tags = []
      if (!m.read) {
        tags.push({ type: 'danger', tag: 'New' })
      }
      let data = {
        level: 1,
        postId: ''
      }
      try {
        data = JSON.parse(m.relativeUrl)
      } catch (e) { }
      page = Math.floor(data.level / postPageSize) + 1

      msgList.push({
        title: m.title,
        content: Tools.extractTextFromHtml(m.content),
        url: m.relativeUrl ? `/post?page=${page}&post_id=${data.postId}#L${data.level}` : '',
        date: Tools.getProperDateString(m.date),
        tags
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
