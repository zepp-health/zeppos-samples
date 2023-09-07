import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { HeartRate } from "@zos/sensor";
import * as Styles from 'zosLoader:./style.[pf].layout.js'

let text_info = null;
let show_text = "";

const logger = log.getLogger('heart.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text: "max heart rate info:",
    });

    let hrSr = new HeartRate()

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "getMaxRecord",
      click_func: () => {
        show_text = "";
        let maxHr = hrSr.getDailySummary();
        if (maxHr != undefined) {
          logger.log(
            "mmax heartRate time",
            maxHr.maximum.time,
            " heartRate ",
            maxHr.maximum.hr_value
          );
          show_text += "max heartRate val:" + maxHr.maximum.hr_value + "\n";
          text_info.setProperty(hmUI.prop.TEXT, show_text);
        } else {
          logger.log("mmax heartRate invalid.");
        }
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
