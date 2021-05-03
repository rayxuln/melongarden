import Tools from '../Tools'
import getPostLevelLikeInfo from './getPostLevelLikeInfo.js'

export default function (postId, pin) {
  return Tools.goAPIPromiseHelper(`api/v1/posts/${postId}/pin`, Tools.goAPIEmptyGetOption(), v => v, '')
}
