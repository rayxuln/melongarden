import Tools from '../Tools'

export default function (postId, level, content) {
  return Tools.goAPIPromiseHelper('api/v1/comments', Tools.goAPIMakeOption('', 'PUT', {
    id: level,
    post_id: typeof postId === 'string' ? Number.parseInt(postId) : postId,
    content
  }), (v) => {
    return {
    }
  }, '')
}
