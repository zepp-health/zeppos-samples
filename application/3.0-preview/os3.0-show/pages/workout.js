import hmUI from "@zos/ui";
import { Workout } from "@zos/sensor";
import { log } from "@zos/utils";
import * as Styles from "zosLoader:./style.[pf].layout.js";

const logger = log.getLogger("workout.page");
const workout = new Workout();

let textWidget = null;
Page({
  onInit() {
    logger.log("page on init invoke");

    textWidget = hmUI.createWidget(hmUI.widget.TEXT, Styles.WORKOUT_TEXT_STYLE);
    const status = workout.getStatus();
    console.log("-----", JSON.stringify(status));
    if (status) {
      const history = workout.getHistory();
      let show_text = "";
      show_text += `vo2max: ${status.vo2Max},trainingLoad: ${status.trainingLoad}, fullRecoveryTime:${status.fullRecoveryTime}\n`;
      history.forEach((item, index) => {
        show_text += `startTime: ${item.startTime}, duration: ${item.duration}s\n`;
      });
      textWidget.setProperty(hmUI.prop.TEXT, show_text);
    }
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
