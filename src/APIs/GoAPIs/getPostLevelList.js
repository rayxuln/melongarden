import Tools, { TagsBuilder } from '../Tools'
import getUserInfo from './getUserInfo'

export default function (postId, pageSize, pageNumber, filter) {
  return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}`, Tools.goAPIGetOption({
    page: pageNumber,
    page_size: pageSize,
    filter: filter
  }), (v) => {
    const levels = []
    for (const c of v.comments) {
      levels.push({
        userAvatarUrl: '',
        userName: c.user_id,
        content: c.content,
        level: c.id,
        date: c.time,
        hasEdited: c.is_edited,
        hasLike: c.vote_status === -1 ? 2 : c.vote_status,
        likeNum: c.vote_up,
        dislikeNum: c.vote_down,
        isPoster: false,
        isLoading: false,
        isAdmin: false,
        isPinned: false,
        isYou: false,
        hasDeleted: c.is_del,
        userTags: []
      })
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
        for (const l of levels) {
          ps.push(Tools.goAPIPromiseHelper(`api/v1/accounts/${l.userName}`, Tools.goAPIEmptyGetOption(), d => d, ''))
        }
        Promise.all(ps).then(res => {
          for (let i = 0; i < res.length; ++i) {
            if (levels[i].level === 1) {
              levels[i].isPinned = postInfo.pinned
            }
            levels[i].isPoster = levels[i].userName === postInfo.user_id
            levels[i].userAvatarUrl = res[i].avatar
            levels[i].isAdmin = currentUserData.is_admin
            levels[i].isYou = currentUserData.id === res[i].id
            levels[i].userTags = (new TagsBuilder()).append('info', res[i].name).append('', `UL${res[i].level}`).append('danger', 'Admin', res[i].is_admin).append('warning', 'You', levels[i].isYou).append('', 'Poster', levels[i].isPoster).build()
          }
          resolve({
            levels,
            levelNum: v.comment_count
          })
        })
      })
    })
  }, '')
}
