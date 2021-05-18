import Tools, { TagsBuilder } from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/checkin/records', Tools.goAPIEmptyGetOption(), (records) => {
    const date = new Date()
    return {
      month: date.getMonth() + 1,
      records,
      hasCheckedIn: records[date.getDate() - 1]
    }
  }, '')
}
