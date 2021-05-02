import Tools, { TagsBuilder } from '../Tools'
import getUserInfo from './getUserInfo'

export default function (postId, level) {
  return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}/${level}`, Tools.goAPIEmptyGetOption(), (v) => {
    const level = {
      userAvatarUrl: '',
      userName: v.user_id,
      content: v.content,
      level: v.id,
      date: v.time,
      hasEdited: v.is_edited,
      hasLike: 0,
      likeNum: v.vote_up,
      dislikeNum: v.vote_down,
      isPoster: false,
      isLoading: false,
      isAdmin: false,
      isPinned: false,
      isYou: false,
      hasDeleted: v.is_del,
      userTags: []
    }
    return new Promise(resolve => {
      getUserInfo().then(currentUserData => {
        const ps = []
        ps.push(Tools.goAPIPromiseHelper(`api/v1/accounts/${level.userName}`, Tools.goAPIEmptyGetOption(), d => d, ''))
        Promise.all(ps).then(res => {
          level.userAvatarUrl = res[0].avatar
          level.isYou = currentUserData.userEmail === res[0].id
          level.userTags = (new TagsBuilder()).append('', `UL${res[0].level}`).append('warning', 'You', level.isYou).build()
          resolve({
            level
          })
        })
      })
    })
  }, '')
}
