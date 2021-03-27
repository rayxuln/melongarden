import Tools from '../Tools'
import Mocker, { Post, promiseHelper } from './Mocker'

function clampContent (content:string, maxContentLength:number, dotLength = 3) {
  if (content === '') return ''
  content = Tools.extractTextFromHtml(content)
  if (content.length > maxContentLength) {
    content = content.substring(0, maxContentLength - dotLength)
    return content.padEnd(maxContentLength, '.')
  }
  return content
}

export default function (pageSize:number, pageNumber:number, filter:string):Promise<unknown> {
  const posts = []
  const res = Mocker.postHelper.getPosts(pageSize, pageNumber, filter, true)
  const rawPosts = res[0] as Array<Post>
  const postNum = res[1] as number
  for (const p of rawPosts) {
    posts.push({
      img: p.getPreviewImage(),
      imgList: p.getAllImges(),
      title: clampContent(p.title, 20),
      content: clampContent(p.getFirstLevel().content, 25),
      userAvatar: Mocker.userHelper.getUserAvatarById(p.getFirstLevel().userId),
      userName: Mocker.userHelper.getUserNameById(p.getFirstLevel().userId),
      postId: p.postId
    })
  }
  return promiseHelper({ posts, postNum }, 1000)
}
