import Tools, { TagsBuilder } from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/checkin', Tools.goAPIEmptyGetOption(), (v) => {
    return v
  }, '')
}
