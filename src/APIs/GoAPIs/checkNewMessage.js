import Tools, { TagsBuilder } from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/messages/unread', Tools.goAPIEmptyGetOption(), (v) => {
    return {
      hasMsg: v.count > 0
    }
  }, '')
}
