import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { BloodOxygen } from "@zos/sensor";
import * as Styles from 'zosLoader:./style.[pf].layout.js'

let text_info = null;
let show_text = "";

const logger = log.getLogger('spo2.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text: "Wear your watch and prepare to measure"
    });

    let spo2Sr = new BloodOxygen();
    const callback = () => {
      const result = spo2Sr.getCurrent()
      if (result.retCode === 2) {
        let d = new Date(result.time * 1000);
        show_text =
          "time: " + d.toLocaleString() + ", value:" + result.value + "\n";
        text_info.setProperty(hmUI.prop.TEXT, show_text);
      }
    }

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "START SPO2",
      click_func: () => {
        spo2Sr.onChange(callback)
        spo2Sr.stop()
        spo2Sr.start()
        text_info.setProperty(hmUI.prop.TEXT, 'measuring...');
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "STOP SPO2",
      click_func: () => {
        logger.log("click to stop spo2");
        spo2Sr.stop();
        spo2Sr.offChange(callback)
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
