import Tools from '../Tools'

export default function (postId, level, like) {
  return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}/${level}/vote/${like === 1 ? 1 : (like === 2 ? -1 : 0)}`, Tools.goAPIEmptyGetOption(), (v) => {
    return {
    }
  }, '')
}
