import Moker, { Post, promiseHelper } from './Mocker'

function getPostContent (post:Post) {
  if (post.postLevelList.length === 0) return ''
  return post.postLevelList[0].content
}

function getDateFullDate (date:Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function getDateDate (date:Date) {
  return `${date.getMonth() + 1}-${date.getDate()}`
}

function getDateTime (date:Date) {
  const min = String(date.getMinutes())
  min.padStart(2, '0')
  return `${date.getHours()}:${min}`
}

function getPostLastUpdateTimeString (post:Post) {
  if (post.postLevelList.length === 0) return ''
  const date = post.postLevelList[post.postLevelList.length - 1].date
  if (date.getFullYear() !== (new Date()).getFullYear()) {
    return getDateFullDate(date)
  }
  if (getDateDate(date) === getDateDate(new Date())) {
    return getDateTime(date)
  }
  return getDateDate(date)
}

export default function (pageSize:number, pageNumber:number):Promise<unknown> {
  const posts = []
  const rawPosts = Moker.postHelper.getPosts(pageSize, pageNumber)
  for (const p of rawPosts) {
    posts.push({
      replyNum: p.getReplyNum(),
      title: p.title,
      content: getPostContent(p),
      poster: Moker.userHelper.getUserNameById(p.getPoster()),
      lastReplior: Moker.userHelper.getUserNameById(p.getLastReplior()),
      showImages: false,
      updateTime: getPostLastUpdateTimeString(p)
    })
  }
  return promiseHelper(posts, 1000)
}
