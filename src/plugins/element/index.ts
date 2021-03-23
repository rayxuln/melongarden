import { App } from '@vue/runtime-core'
import { ElAffix, ElAvatar, ElBacktop, ElButton, ElCard, ElEmpty, ElIcon, ElInput, ElLink, ElMenu, ElMenuItem, ElPagination, ElSkeleton, ElTag } from 'element-plus'

export default (app:App):void => {
  app.use(ElButton)
  app.use(ElInput)
  app.use(ElIcon)
  app.use(ElAffix)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElCard)
  app.use(ElAvatar)
  app.use(ElEmpty)
  app.use(ElPagination)
  app.use(ElBacktop)
  app.use(ElSkeleton)
  app.use(ElLink)
  app.use(ElTag)
}
