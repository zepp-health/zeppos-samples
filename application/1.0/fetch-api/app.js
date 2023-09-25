import "./shared/device-polyfill";
import { MessageBuilder } from "./shared/message";

App({
  globalData: {
    messageBuilder: null
  },
  onCreate(options) {
    console.log("app on create invoke");
    let appId;
    if (!hmApp.packageInfo) {
      // appId = XXX // Modify appId
      throw new Error('Set appId,  appId needs to be the same as the configuration in app.json');
    } else {
      appId = hmApp.packageInfo().appId;
    }
    this.globalData.messageBuilder = new MessageBuilder({
      appId,
    });
    this.globalData.messageBuilder.connect();
  },

  onDestroy(options) {
    console.log("app on destroy invoke");
    this.globalData.messageBuilder.disConnect();
  },
});
