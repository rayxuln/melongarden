import { App } from '@vue/runtime-core'
import { ElAffix, ElAutocomplete, ElAvatar, ElBacktop, ElBadge, ElButton, ElCard, ElCol, ElDivider, ElDropdown, ElDropdownItem, ElDropdownMenu, ElEmpty, ElForm, ElFormItem, ElIcon, ElImage, ElInput, ElLink, ElLoading, ElMenu, ElMenuItem, ElMessageBox, ElPageHeader, ElPagination, ElPopover, ElRow, ElSkeleton, ElTag, ElUpload } from 'element-plus'

import useTooltip from './useTooltip.js'

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
  app.use(ElLoading)
  app.use(ElImage)
  app.use(ElPageHeader)
  app.use(ElMessageBox)
  app.use(ElPopover)
  app.use(ElBadge)
  app.use(ElDropdown)
  app.use(ElDropdownMenu)
  app.use(ElDropdownItem)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElUpload)
  app.use(ElDivider)
  app.use(ElRow)
  app.use(ElCol)
  useTooltip(app)
  app.use(ElAutocomplete)
}
