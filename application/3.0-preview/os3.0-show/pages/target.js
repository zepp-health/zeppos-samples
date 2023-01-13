import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";

let from;

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

Page({
  onInit(param) {
    logger.log("page on init invoke");
    from = param;
  },
  build() {
    // Show tips
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80,
      w: DEVICE_WIDTH - 40 * 2,
      h: 80,
      text_size: 32,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: "What happens?",
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 150,
      w: DEVICE_WIDTH - 40 * 2,
      h: 120,
      text_size: 24,
      color: 0xffffff,
      text: `From: ${from}`,
    });
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
