import hmUI from '@zos/ui'
import { Screen } from '@zos/sensor'
import { log } from '@zos/utils'
import * as Styles from 'zosLoader:./style.[pf].layout.js'

const logger = log.getLogger('screen.page')
const screen = new Screen();

let textWidget = null;
Page({
  onInit() {
    logger.log("page on init invoke");

    textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TEXT_STYLE,
      text: "screen Info: status: " + screen.getStatus(),
      color: 0x34e073,
    });

    const callback = () => {
        const show_text =
        "screen Info: status: " + screen.getStatus()
      textWidget.setProperty(hmUI.prop.TEXT, show_text);
      }

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.START_BUTTON,
      text: "START screen",
      click_func: () => {
        logger.log("click to start screen");
        screen.onChange(callback);
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.STOP_BUTTON,
      text: "STOP screen",
      click_func: () => {
        logger.log("click to stop screen");
        screen.offChange(callback);
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
