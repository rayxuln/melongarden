import Tools from '../Tools'
import getPostLevelLikeInfo from './getPostLevelLikeInfo.js'

export default function (postId, level, like) {
  like = like === 2 ? -1 : like
  return getPostLevelLikeInfo(postId, level).then((v) => {
    const userLike = v.hasLike === 2 ? -1 : v.hasLike
    return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}/${level}/vote/${like === userLike ? 0 : like}`, Tools.goAPIEmptyGetOption(), (v) => {
      return {
      }
    }, '', {
      401: 'You have not signed in yet!'
    })
  })
}
