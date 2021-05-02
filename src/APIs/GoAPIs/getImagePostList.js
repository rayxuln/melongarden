import Tools from '../Tools'

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
    image_mode: true
  }), (v) => {
    const posts = []
    for (let i = 0; i < v.posts.length; ++i) {
      posts.push({
        img: '',
        imgList: [],
        title: v.posts[i].title,
        content: v.post_briefs[i],
        userAvatar: '',
        userName: v.posts[i].user_id,
        postId: String(v.posts[i].id)
      })
    }
    return {
      posts,
      postNum: v.total_posts
    }
  }, '')
}
