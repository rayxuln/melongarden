import Tools from './Tools'
import Moker, { Post, promiseHelper } from './Mocker'

function getPostContent (post:Post) {
  if (post.postLevelList.length === 0) return ''
  const MAX_CONTENT_LENGTH = 50
  const DOT_LENGTH = 3
  let content = post.postLevelList[0].content
  if (content === '') return ''
  content = content.replace(/<[^<>]+>/g, '')
  if (content.length > MAX_CONTENT_LENGTH) {
    content = content.substring(0, MAX_CONTENT_LENGTH - DOT_LENGTH)
    return content.padEnd(MAX_CONTENT_LENGTH, '.')
  }
  return content
}

function getPostLastUpdateTimeString (post:Post) {
  if (post.postLevelList.length === 0) return ''
  const date = post.postLevelList[post.postLevelList.length - 1].date
  if (date.getFullYear() !== (new Date()).getFullYear()) {
    return Tools.getDateFullDate(date)
  }
  if (Tools.getDateDate(date) === Tools.getDateDate(new Date())) {
    return Tools.getDateTime(date)
  }
  return Tools.getDateDate(date)
}

function getImagesInPost (content:string) {
  const images = []
  const reg = /<img((?!scr=")[.\s])+src="(([^"]|\\")*)"/gim
  let res = reg.exec(content)
  while (res !== null && images.length < 3) {
    images.push(res[2])
    res = reg.exec(content)
  }
  return images
}

function genImage (small:string, big = '') {
  if (big === '') big = small
  else if (small === '') small = big
  return {
    big,
    small
  }
}

export default function (pageSize:number, pageNumber:number):Promise<unknown> {
  const posts = []
  const rawPosts = Moker.postHelper.getPosts(pageSize, pageNumber)
  for (const p of rawPosts) {
    const images:Array<Record<string, string>> = []
    const imageSources = p.postLevelList.length > 0 ? getImagesInPost(p.postLevelList[0].content) : []
    imageSources.forEach(i => {
      images.push(genImage(i))
    })
    posts.push({
      replyNum: p.getReplyNum(),
      title: p.title,
      content: getPostContent(p),
      poster: Moker.userHelper.getUserNameById(p.getPoster()),
      lastReplior: Moker.userHelper.getUserNameById(p.getLastReplior()),
      updateTime: getPostLastUpdateTimeString(p),
      postId: p.postId,
      images
    })
  }
  return promiseHelper(posts, 1000)
}
