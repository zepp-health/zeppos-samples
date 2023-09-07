import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Gyroscope } from "@zos/sensor";
import * as Styles from "zosLoader:./style.[pf].layout.js";

const gyro = new Gyroscope();
let text = null;
const logger = log.getLogger("gyro.page");
Page({
  onInit() {
    logger.log("page on init invoke");

    text = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text: "GYRO Info simulator sample value is from horizontal to vertical",
    });

    gyro.onChange(function (cb_info) {
      const show_text =
        "gryo info\nx:" + cb_info.x + "\ny:" + cb_info.y + "\nz:" + cb_info.z;
      text.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "START GYRO",
      click_func: () => {
        logger.log("click to start gyro");
        gyro.start();
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "STOP GYRO",
      click_func: () => {
        logger.log("click to stop gyro");
        gyro.stop();
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
    gyro && gyro.stop();
  },
});
