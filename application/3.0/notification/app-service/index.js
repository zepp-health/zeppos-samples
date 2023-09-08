import { log as Logger } from "@zos/utils";
import { getText } from "@zos/i18n";
import * as notificationMgr from "@zos/notification";

const logger = Logger.getLogger("index-service");

AppService({
  onInit(params) {
    logger.log("index onInit=", params);
    this.invokeNotification(params);
  },
  invokeNotification(params) {
    notificationMgr.notify({
      title: getText("title"),
      content: getText("content"),
      actions: [],
      vibrate: 6,
    });
  },
});
