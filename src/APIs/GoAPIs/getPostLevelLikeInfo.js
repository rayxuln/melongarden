import Tools, { TagsBuilder } from '../Tools'
import getUserInfo from './getUserInfo'

export default function (postId, level) {
  return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}/${level}`, Tools.goAPIEmptyGetOption(), (v) => {
    return {
      hasLike: v.vote_status === -1 ? 2 : v.vote_status,
      likeNum: v.vote_up,
      dislikeNum: v.vote_down
    }
  }, '')
}
