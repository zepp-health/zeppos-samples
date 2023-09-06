import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { push } from "@zos/router";
import { createEmptySpace } from './../components/empty-space'
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

const logger = log.getLogger('sensor')
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
      text: "OS3.0 Health & Pos Sensor",
    });

    const sensorsArray = [
      { name: "ACC Sensor", url: "pages/acc"},
      { name: "Workout Sensor", url: "pages/workout"},
      { name: "GPS Sensor", url: "pages/gps"},
      { name: "GYRO Sensor", url: "pages/gyro"},
      { name: "Compass Sensor", url: "pages/compass"},
      { name: "Sleep Sensor", url: "pages/sleep"},
      { name: "Heart Sensor", url: "pages/heart"},
      { name: "Spo2 Sensor", url: "pages/spo2"},
      { name: "Stress Sensor", url: "pages/stress"}
    ]
    sensorsArray.forEach((sensor, index) => {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...BUTTON,
        y: BUTTON_Y + BUTTON_OY * index,
        text: sensor.name,
        click_func: function (button) {
          push({
            url: sensor.url,
          });
        },
      });
    })
    createEmptySpace(BUTTON_Y + BUTTON_OY * sensorsArray.length)
  },
  onHide() {
    logger.log("page on hide invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
