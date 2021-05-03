import Tools, { TagsBuilder } from '../Tools'
import getPostLevel from './getPostLevel.js'

export default function (pageSize, pageNumber, filter, postPageSize) {
  return Tools.goAPIPromiseHelper('api/v1/me/comments', Tools.goAPIGetOption({
    page: pageNumber,
    page_size: pageSize,
    filter: filter
  }), (v) => {
    const dataList = []
    const postIdList = {}
    for (let i = 0; i < v.comments.length; ++i) {
      const page = Math.floor((v.comments[i].id - 1) / postPageSize) + 1
      postIdList[v.comments[i].post_id] = true
      dataList.push({
        title: '',
        content: Tools.trimTextWithLength(Tools.extractTextFromHtml(v.comments[i].content), 50),
        url: `/post?page=${page}&post_id=${v.comments[i].post_id}#L${v.comments[i].id}`,
        date: v.comments[i].time,
        tags: [],
        postId: v.comments[i].post_id
      })
    }
    const postInfoPromiseList = []
    for (const pid in postIdList) {
      postInfoPromiseList.push(Tools.goAPIPromiseHelper(`api/v1/posts/${pid}`, Tools.goAPIEmptyGetOption(), v => v, ''))
    }
    return new Promise(resolve => {
      Promise.all(postInfoPromiseList).then(postInfoList => {
        for (const p of postInfoList) {
          postIdList[p.id] = p.title
        }
        for (const d of dataList) {
          d.title = postIdList[d.postId]
        }
        resolve({
          dataList: dataList,
          totalNum: v.comment_count
        })
      })
    })
  }, '')
}
