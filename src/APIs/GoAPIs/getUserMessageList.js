import Tools, { TagsBuilder } from '../Tools'
import getPostLevel from './getPostLevel.js'

export default function (pageSize, pageNumber, filter, postPageSize) {
  return Tools.goAPIPromiseHelper('api/v1/messages', Tools.goAPIEmptyGetOption(), (v) => {
    const dataList = []
    for (const d of v) {
      const page = Math.floor((d.comment_id - 1) / postPageSize) + 1
      dataList.push({
        title: `@${d.from} has commented on your post.`,
        content: '',
        url: `/post?page=${page}&post_id=${d.post_id}#L${d.comment_id}`,
        date: '',
        tags: !d.read ? (new TagsBuilder()).append('danger', 'New').build() : [],
        post_id: d.post_id,
        comment_id: d.comment_id
      })
      Promise.resolve(Tools.goAPIPromiseHelper(`api/v1/messages/${d.post_id}/${d.comment_id}`, Tools.goAPIEmptyGetOption(), v => v, ''))
    }
    // return {
    //   dataList,
    //   totalNum: v.length
    // }
    return new Promise(resolve => {
      const ps = []
      for (let i = 0; i < dataList.length; ++i) {
        ps.push(getPostLevel(dataList[i].post_id, dataList[i].comment_id))
      }

      Promise.all(ps).then(res => {
        for (let i = 0; i < res.length; ++i) {
          dataList[i].content = res.level.content
        }

        resolve({
          dataList,
          totalNum: dataList.length
        })
      })
    })
  }, '')
}
