import { App } from '@vue/runtime-core'
import { ElButton } from 'element-plus'

export default (app:App):void => {
  app.use(ElButton)
}
