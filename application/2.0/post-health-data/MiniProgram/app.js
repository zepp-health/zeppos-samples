import { log as Logger } from "@zos/utils";
import { BaseApp } from "@zeppos/zml/base/base-app";
import { appPlugin } from "@zeppos/zml/2.0/module/messaging/plugin/app";

BaseApp.use(appPlugin);

const logger = Logger.getLogger("post-health-data");

App(
  BaseApp({
    globalData: {},
    onCreate() {
      logger.log("app onCreate invoked");
    },
    onDestroy() {
      logger.log("app onDestroy invoked");
    },
  })
);
