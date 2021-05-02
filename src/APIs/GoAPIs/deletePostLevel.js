import Tools from '../Tools'

export default function (postId, level) {
  if (level > 1) {
    return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}/${level}`, Tools.goAPIMakeOption('', 'DELETE', {}), (v) => {
      return {
        hasDeletePost: false
      }
    }, '')
  } else {
    return Tools.goAPIPromiseHelper(`api/v1/posts/${postId}`, Tools.goAPIMakeOption('', 'DELETE', {}), (v) => {
      return {
        hasDeletePost: true
      }
    }, '')
  }
}
