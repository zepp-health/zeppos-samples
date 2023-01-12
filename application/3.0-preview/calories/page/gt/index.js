import { log as Logger } from '@zos/utils'
import { layout } from 'zosLoader:./[name].[pf].layout.js'

const logger = Logger.getLogger('calories')
Page({
  build() {
    logger.debug('page build invoked')
    layout.render(this)
  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
  },
})
