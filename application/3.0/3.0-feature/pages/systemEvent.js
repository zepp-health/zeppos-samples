import { log } from "@zos/utils";
import hmUI from "@zos/ui";
import { emitCustomSystemEvent } from '@zos/app'
import { getDeviceInfo } from "@zos/device";
import {
  SERVICE_BTN,
} from "zosLoader:./style.[pf].layout.js";

const { width: DEVICE_WIDTH } = getDeviceInfo();

const logger = log.getLogger("bgService.page");

Page({
  state: {
    serviceBtn: null,
  },
  onInit() {
    logger.log("page on init invoke");
  },
  build() {
    const vm = this;

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80,
      w: DEVICE_WIDTH - 40 * 2,
      h: 80,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: "Click Button and then\ncheck the log in console!",
    });

    vm.state.serviceBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
      ...SERVICE_BTN,
      text: 'Call Custom System Event',
      click_func: function () {
        emitCustomSystemEvent({
          eventName: 'event:customize.test',
          eventParam: 'eventName=event:customize.test&type=0',
        })
      },
    });
  },
  onPause() {
    logger.log("page on pause invoke");
  },
  onResume() {
    logger.log("page on resume invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
