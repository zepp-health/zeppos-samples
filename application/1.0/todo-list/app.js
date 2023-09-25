import './shared/device-polyfill'
import { MessageBuilder } from './shared/message'

const logger = DeviceRuntimeCore.HmLogger.getLogger('todo-list-app')

App({
  globalData: {
    messageBuilder: null
  },
  onCreate() {
    logger.log('app onCreate invoked');
    let appId;
    if (!hmApp.packageInfo) {
      // appid = XXX // Modify appId
      throw new Error('Set appId,  appId needs to be the same as the configuration in app.json');
    } else {
      appId = hmApp.packageInfo().appId;
    }
    this.globalData.messageBuilder = new MessageBuilder({
      appId,
    });
    this.globalData.messageBuilder.connect();
  },
  onDestroy() {
    logger.log('app onDestroy invoked');
    this.globalData.messageBuilder.disConnect();
  }
})
