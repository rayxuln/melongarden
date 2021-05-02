import Tools, { TagsBuilder } from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/me/account', Tools.goAPIEmptyGetOption(), (v) => {
    return {
      userPostNum: v.post_count,
      userReplyNum: v.comment_count,
      userName: v.name,
      userAvatar: v.avatar,
      userEmail: v.id,
      userTags: (new TagsBuilder()).append('', `UL${v.level}`).build(),
      userDescription: v.description
    }
  }, '')
}
