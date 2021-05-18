import Tools, { TagsBuilder } from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/top', Tools.goAPIEmptyGetOption(), (v) => {
    const hottopList = []
    for (let i = 0; i < v.ids.length; ++i) {
      hottopList.push({
        title: v.titles[i],
        id: v.ids[i]
      })
    }
    return {
      hottopList
    }
  }, '')
}
