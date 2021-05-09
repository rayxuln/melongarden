import Tools, { TagsBuilder } from '../Tools'
import checkToken from './checkToken.js'
import getPostLevelLikeInfo from './getPostLevelLikeInfo.js'

function genImage (small, big = '') {
  if (big === '') big = small
  else if (small === '') small = big
  return {
    big,
    small
  }
}

function translateImageArray (images) {
  const res = []
  if (!images) return res
  for (const i of images) {
    res.push(genImage(i))
  }
  return res
}

export default function (pageSize, pageNumber, filter) {
  return Tools.goAPIPromiseHelper('api/v1/posts', Tools.goAPIGetOption({
    page: pageNumber,
    page_size: pageSize,
    filter: filter
  }), (v) => {
    const posts = []
    for (let i = 0; i < v.posts.length; ++i) {
      posts.push({
        replyNum: v.posts[i].comment_count,
        title: v.posts[i].title,
        titleTags: (new TagsBuilder()).append('warning', 'Pinned', v.posts[i].pinned).build(),
        content: v.post_briefs[i],
        poster: v.posts[i].user_id,
        lastReplior: v.posts[i].reply_user_id,
        updateTime: v.posts[i].latest_reply,
        postId: v.posts[i].id,
        hasLike: v.vote_status === -1 ? 2 : v.vote_status,
        likeNum: v.posts[i].vote_up,
        dislikeNum: v.posts[i].vote_down,
        images: translateImageArray(v.post_images[i])
      })
    }
    // return {
    //   posts,
    //   postNum: v.total_posts
    // }
    return new Promise(resolve => {
      checkToken().then(() => {
        const postLikeInfoPromiseList = []
        for (const p of posts) {
          postLikeInfoPromiseList.push(getPostLevelLikeInfo(p.postId, 1))
        }
        Promise.all(postLikeInfoPromiseList).then(likeInfoList => {
          for (let i = 0; i < likeInfoList.length; ++i) {
            posts[i].hasLike = likeInfoList[i].hasLike
          }
        }).catch(e => {
          console.error(e)
          return e
        }).then(() => {
          resolve({
            posts,
            postNum: v.total_posts
          })
        })
      }).catch(() => {
        resolve({
          posts,
          postNum: v.total_posts
        })
      })
    })
  }, '')
}
