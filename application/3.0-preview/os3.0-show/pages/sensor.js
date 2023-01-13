import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";
import { push } from "@zos/router";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

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
      text: "JS Demo Health & Pos Sensor",
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      text: "ACC Sensor",
      click_func: function (button) {
        push({
          url: "pages/acc",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 1,
      text: "GPS Sensor",
      click_func: function (button) {
        push({
          url: "pages/gps",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 2,
      text: "GYRO Sensor",
      click_func: function (button) {
        push({
          url: "pages/gyro",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 3,
      text: "Compass Sensor",
      click_func: function (button) {
        push({
          url: "pages/compass",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 4,
      text: "Sleep Sensor",
      click_func: function (button) {
        push({
          url: "pages/sleep",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 5,
      text: "Heart Sensor",
      click_func: function (button) {
        push({
          url: "pages/heart",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 6,
      text: "Spo2 Sensor",
      click_func: function (button) {
        push({
          url: "pages/spo2",
        });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BUTTON,
      y: BUTTON_Y + BUTTON_OY * 7,
      text: "Stress Sensor",
      click_func: function (button) {
        push({
          url: "pages/stress",
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
