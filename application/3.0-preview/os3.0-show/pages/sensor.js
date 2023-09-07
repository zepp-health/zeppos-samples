import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { push } from "@zos/router";
import { createEmptySpace } from './../components/empty-space'
import * as Styles from 'zosLoader:./style.[pf].layout.js'

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
      ...Styles.MAIN_TITLE_STYLE,
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
        ...Styles.MAIN_BUTTON,
        y: Styles.MAIN_BUTTON_Y + Styles.MAIN_BUTTON_OY * index,
        text: sensor.name,
        click_func: function (button) {
          push({
            url: sensor.url,
          });
        },
      });
    })
    createEmptySpace(Styles.MAIN_BUTTON_Y + Styles.MAIN_BUTTON_OY * sensorsArray.length)
  },
  onHide() {
    logger.log("page on hide invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
