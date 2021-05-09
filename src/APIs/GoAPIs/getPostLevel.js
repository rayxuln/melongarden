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
      hasLike: v.vote_status === -1 ? 2 : v.vote_status,
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
      let postInfo = {}
      Tools.goAPIPromiseHelper(`api/v1/posts/${postId}`, Tools.goAPIEmptyGetOption(), v => v, '').then(post => {
        postInfo = post
        return Tools.goAPIPromiseHelper('api/v1/me/account', Tools.goAPIEmptyGetOption(), v => v, '', {
          401: ''
        })
      }).catch(e => {
        return {
          is_admin: false,
          id: ''
        }
      }).then(currentUserData => {
        const ps = []
        ps.push(Tools.goAPIPromiseHelper(`api/v1/accounts/${level.userName}`, Tools.goAPIEmptyGetOption(), d => d, ''))
        Promise.all(ps).then(res => {
          if (level.level === 1) {
            level.isPinned = postInfo.pinned
          }
          level.isPoster = level.userName === postInfo.user_id
          level.userAvatarUrl = res[0].avatar
          level.isAdmin = currentUserData.is_admin
          level.isYou = currentUserData.id === res[0].id
          level.userTags = (new TagsBuilder()).append('info', res[0].name).append('', `UL${res[0].level}`, false).append('danger', 'Admin', res[0].is_admin).append('warning', 'You', level.isYou).append('', 'Poster', level.isPoster).build() // TODO: NOT RELEASE2
          resolve({
            level
          })
        })
      })
    })
  }, '')
}
