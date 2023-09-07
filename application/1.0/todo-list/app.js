import './shared/device-polyfill'
import { MessageBuilder } from './shared/message'

const logger = DeviceRuntimeCore.HmLogger.getLogger('todo-list-app')
const appDevicePort = 20
const appSidePort = 0
const appId = 20001
const messageBuilder = new MessageBuilder({
  appId,
  appDevicePort,
  appSidePort
})

App({
  globalData: {
    messageBuilder: messageBuilder
  },
  onCreate() {
    logger.log('app onCreate invoked')
    messageBuilder.connect()
  },

  onDestroy() {
    logger.log('app onDestroy invoked')
    messageBuilder.disConnect()
  }
})
