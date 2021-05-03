import Tools from '../Tools'

export default function (title, content) {
  return Tools.goAPIPromiseHelper('api/v1/posts', Tools.goAPIMakeOption('', 'POST', {
    content: content === '' ? ' ' : content,
    title
  }), (v) => {
    return {
    }
  }, '')
}
