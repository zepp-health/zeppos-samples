import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { SERVICE_TEXT, SERVICE_LABEL } from 'zosLoader:./style.[pf].layout.js'
let from;

const logger = log.getLogger('target.page')
Page({
  onInit(param) {
    logger.log("page on init invoke");
    from = param;
  },
  build() {
    // Show tips
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...SERVICE_TEXT,
      text: "What happens?",
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      ...SERVICE_LABEL,
      text: `From: ${from}`,
    });
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
