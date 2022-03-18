import { TEXT_STYLE } from './index.style'

const logger = DeviceRuntimeCore.HmLogger.getLogger('hello-world-page')
Page({
  build() {
    logger.log('page build invoked')
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...TEXT_STYLE,
    })
  },
  onInit() {
    logger.log('page onInit invoked')
  },

  onDestroy() {
    logger.log('page onDestroy invoked')
  },
})
