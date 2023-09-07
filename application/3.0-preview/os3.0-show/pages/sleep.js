import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Sleep } from "@zos/sensor";
import * as Styles from 'zosLoader:./style.[pf].layout.js'

let text_info = null;
let show_text = "";

const logger = log.getLogger('sleep.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text_size: 15,
      text: "Sleep Sensor Function Info:",
    });

    let sleepSr = new Sleep();

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "Is sleeping ?",
      click_func: () => {
        let sleeping = sleepSr.getSleepingStatus();

        hmUI.showToast({ text: `${sleeping}` });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "Short Sleep Info",
      click_func: () => {
        logger.log("click to get sleep data");

        let shortSlp = sleepSr.getNap();
        show_text = "";
        if (shortSlp != undefined) {
          for (let item of shortSlp) {
            logger.log(
              "length ",
              item.length,
              " start ",
              item.start,
              " stop ",
              item.stop
            );

            start_hour = parseInt(item.start / 60);
            start_minute = parseInt(item.start % 60);

            stop_hour = parseInt(item.stop / 60);
            stop_minute = parseInt(item.stop % 60);

            show_text +=
              "start time: " +
              start_hour +
              ":" +
              start_minute +
              " stop time: " +
              stop_hour +
              ":" +
              stop_minute +
              "sleep time: " +
              item.length +
              " minutes" +
              "\n";

            text_info.setProperty(hmUI.prop.TEXT, show_text);
          }
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
