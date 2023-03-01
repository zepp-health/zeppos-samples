import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { push } from "@zos/router";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } =
  getDeviceInfo();

const BUTTON_W = 200;
const BUTTON_H = 45;
const BUTTON_X = (DEVICE_WIDTH - BUTTON_W) / 2;
const BUTTON_Y = 170;
const BUTTON_OY = 50;
const BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H,
  radius: 8,
  press_color: 0x1976d2,
  normal_color: 0xef5350,
};

const logger = log.getLogger('index.page')

Page({
  onCreate(e) {
    logger.log("app on create invoke");
  },
  onInit() {
    logger.log("page on init invoke");
  },
  onShow() {
    logger.log("page on show invoke");
  },
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 60,
      w: DEVICE_WIDTH - 40 * 2,
      h: 100,
      text_size: 32,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: "New Feature\nWelcome to Zepp OS 3.0",
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      text: "BG Service",
      click_func: function (button) {
        push({
          url: "pages/bgService",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 1,
      text: "Notification",
      click_func: function (button) {
        push({
          url: "pages/notification",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 2,
      text: "Alarm",
      click_func: function (button) {
        push({
          url: "pages/alarm",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 3,
      text: "Canvas",
      click_func: function (button) {
        push({
          url: "pages/canvas",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 4,
      text: "Health",
      click_func: function (button) {
        push({
          url: "pages/sensor",
        });
      },
    });
  },
  onHide() {
    logger.log("page on hide invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
