import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Compass } from "@zos/sensor";
import * as Styles from "zosLoader:./style.[pf].layout.js";

const compass = new Compass();
let text = null;
const logger = log.getLogger("compass.page");
Page({
  onInit() {
    logger.log("page on init invoke");

    text = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      y: Styles.BUTTON_Y + Styles.BUTTON_H * 3,
      text: "Compass Info simulator value from 0 degree to 360 degree",
    });

    compass.onChange(function () {
      let show_text = "compass info:";
      show_text += "\ndirection_angle:" + compass.getDirectionAngle();
      show_text += "\ndirection:" + compass.getDirection();
      text.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "START COMPASS",
      click_func: () => {
        logger.log("click to start compass");
        compass.start();
        if (!compass.calibration_status) {
          text.setProperty(
            hmUI.prop.TEXT,
            "please enter compass apps to calibrate"
          );
        }
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "STOP COMPASS",
      click_func: () => {
        logger.log("click to stop compass");
        compass.stop();
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
    compass && compass.stop();
  },
});
