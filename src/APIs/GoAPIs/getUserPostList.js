import Tools, { TagsBuilder } from '../Tools'
import getPostLevel from './getPostLevel.js'

export default function (pageSize, pageNumber, filter, postPageSize) {
  return Tools.goAPIPromiseHelper('api/v1/posts', Tools.goAPIGetOption({
    page: pageNumber,
    page_size: pageSize,
    only_me: true,
    filter: filter,
    image_mdoe: false
  }), (v) => {
    const dataList = []
    for (let i = 0; i < v.posts.length; ++i) {
      dataList.push({
        title: v.posts[i].title,
        content: v.post_briefs[i],
        url: `/post?post_id=${v.posts[i].id}`,
        date: v.posts[i].latest_reply,
        tags: []
      })
    }
    return {
      dataList: dataList,
      totalNum: v.total_posts
    }
  }, '')
}
