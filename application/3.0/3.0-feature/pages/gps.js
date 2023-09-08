import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Geolocation } from "@zos/sensor";
import * as Styles from "zosLoader:./style.[pf].layout.js";

const gps = new Geolocation();
let text = null;

const logger = log.getLogger("gps.page");
Page({
  onInit() {
    logger.log("page on init invoke");

    text = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text: "GPS Info Simulator sample value is referred from Los Angeles",
    });

    gps.onChange(function (cb_info) {
      const latitude = `${cb_info.latitude.degrees}°${cb_info.latitude.minutes}.${cb_info.latitude.seconds}`;
      const longitude = `${cb_info.longitude.degrees}°${cb_info.longitude.minutes}.${cb_info.longitude.seconds}`;
      const show_text = "latitude: " + latitude + "\nlongitude: " + longitude;

      text.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "START GPS",
      click_func: () => {
        logger.log("click to start gps");
        gps.start();
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "STOP GPS",
      click_func: () => {
        logger.log("click to stop gps");
        gps.stop();
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
    gps && gps.stop();
  },
});
