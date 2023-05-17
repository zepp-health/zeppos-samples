import { createWidget, widget } from '@zos/ui'
import { log as Logger } from '@zos/utils'
import { TEXT_STYLE } from './index.style'

const logger = Logger.getLogger('helloworld')
Page({
  build() {
    logger.debug('page build invoked')
    createWidget(widget.TEXT, {
      ...TEXT_STYLE,
    })
  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
  },
})