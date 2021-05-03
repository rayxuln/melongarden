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
        img: v.post_images[i][0],
        imgList: v.post_images[i],
        title: v.posts[i].title,
        content: Tools.trimTextWithLength(v.post_briefs[i], 20),
        userAvatar: '',
        userName: v.posts[i].user_id,
        postId: String(v.posts[i].id)
      })
    }
    const userInfoPromiseList = []
    for (const p of posts) {
      userInfoPromiseList.push(Tools.goAPIPromiseHelper(`api/v1/accounts/${p.userName}`, Tools.goAPIEmptyGetOption(), v => v, ''))
    }
    return new Promise(resolve => {
      Promise.all(userInfoPromiseList).catch(e => {
        return []
      }).then(res => {
        if (res && res instanceof Array && res.length > 0) {
          for (let i = 0; i < res.length; ++i) {
            posts[i].userAvatar = res[i].avatar
          }
        }
        resolve({
          posts,
          postNum: v.total_posts
        })
      })
    })
  }, '')
}
