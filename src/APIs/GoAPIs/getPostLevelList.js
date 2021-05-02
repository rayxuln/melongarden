import Tools, { TagsBuilder } from '../Tools'
import getUserInfo from './getUserInfo'

export default function (postId, pageSize, pageNumber, filter) {
  return Tools.goAPIPromiseHelper(`api/v1/comments/${postId}`, Tools.goAPIGetOption({
    page: pageNumber,
    page_size: pageSize
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
        hasLike: 0,
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
      getUserInfo().then(currentUserData => {
        const ps = []
        for (const l of levels) {
          ps.push(Tools.goAPIPromiseHelper(`api/v1/accounts/${l.userName}`, Tools.goAPIEmptyGetOption(), d => d, ''))
        }
        Promise.all(ps).then(res => {
          for (let i = 0; i < res.length; ++i) {
            levels[i].userAvatarUrl = res[i].avatar
            levels[i].isYou = currentUserData.userEmail === res[i].id
            levels[i].userTags = (new TagsBuilder()).append('', `UL${res[i].level}`).append('warning', 'You', levels[i].isYou).build()
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
