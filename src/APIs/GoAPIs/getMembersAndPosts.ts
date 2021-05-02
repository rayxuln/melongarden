import Tools from '../Tools'

export default function ():Promise<unknown> {
  return Tools.goAPIPromiseHelper('api/v1/forum/info', Tools.goAPIEmptyGetOption(), (v:Record<string, unknown>) => {
    return {
      members: v.user_count,
      posts: v.post_count
    }
  }, 'Can\'t load members and posts.')
}
