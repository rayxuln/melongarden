import Tools from '../Tools'

export default function (postId) {
  return Tools.goAPIPromiseHelper(`api/v1/posts/${postId}`, Tools.goAPIEmptyGetOption(), (v) => {
    return {
      levelNum: v.comment_count,
      title: v.title
    }
  }, '')
}
