import { App } from '@vue/runtime-core'
import { ElAffix, ElButton, ElCard, ElIcon, ElInput, ElMenu, ElMenuItem } from 'element-plus'

export default (app:App):void => {
  app.use(ElButton)
  app.use(ElInput)
  app.use(ElIcon)
  app.use(ElAffix)
  app.use(ElMenu)
  app.use(ElMenuItem)
  app.use(ElCard)
}
