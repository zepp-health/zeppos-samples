import { log } from "@zos/utils";

const logger = log.getLogger("app");

App({
  globalData: {},
  onCreate(options) {
    logger.log("app onCreate");
  },
  onDestroy(options) {
    logger.log("app onDestroy");
  },
});
