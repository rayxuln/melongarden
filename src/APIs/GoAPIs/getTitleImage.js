import Tools from '../Tools'

export default function () {
  return Tools.goAPIPromiseHelper('api/v1/forum/info', Tools.goAPIEmptyGetOption(), (v) => {
    return {
      url: v.header_image === '' ? process.env.BASE_URL + 'logo.png' : v.header_image
    }
  }, '')
}
