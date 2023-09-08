import hmUI from "@zos/ui";
import { Accelerometer } from "@zos/sensor";
import { log } from "@zos/utils";
import * as Styles from "zosLoader:./style.[pf].layout.js";

const logger = log.getLogger("acc.page");
const acc = new Accelerometer();

let textWidget = null;
Page({
  onInit() {
    logger.log("page on init invoke");

    textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text: "ACC Info simulator sample value from positive horizontal to negative horizontal",
    });

    acc.onChange(function (cb_info) {
      const show_text =
        "acc info\nx:" + cb_info.x + "\ny:" + cb_info.y + "\nz:" + cb_info.z;
      textWidget.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "START ACC",
      click_func: () => {
        logger.log("click to start acc");
        acc.start();
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "STOP ACC",
      click_func: () => {
        logger.log("click to stop acc");
        acc.stop();
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
    acc && acc.stop();
  },
});
