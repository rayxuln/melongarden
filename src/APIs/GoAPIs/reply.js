import Tools from '../Tools'

export default function (postId, content) {
  return Tools.goAPIPromiseHelper('api/v1/comments', Tools.goAPIMakeOption('', 'POST', {
    content,
    post_id: Number.parseInt(postId)
  }), (v) => {
    return {
      level: v.comment_id
    }
  }, '')
}
