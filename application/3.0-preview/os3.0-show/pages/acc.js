import hmUI from '@zos/ui'
import { Accelerometer } from '@zos/sensor';
import { log } from '@zos/utils'
import { DEVICE_WIDTH } from '../libs/utils'

const BUTTON_X = 50;
const BUTTON_Y = 80;
const BUTTON_W = DEVICE_WIDTH - 2 * BUTTON_X;
const BUTTON_H = 50;
const BUTTON_MARGIN_TOP = 20;
const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

const START_BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: 16,
};

const STOP_BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y + BUTTON_H * 2,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: 16,
};

const logger = log.getLogger('acc.page')
const acc = new Accelerometer();

let textWidget = null;
Page({
  onInit() {
    logger.log("page on init invoke");

    textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 4,
      w: BUTTON_W,
      h: BUTTON_H * 2,
      text_size: 18,
      text: "ACC Info simulator sample value from positive horizontal to negative horizontal",
      color: 0x34e073,
    });

    acc.onChange(function (cb_info) {
      const show_text =
        "acc info\nx:" + cb_info.x + "\ny:" + cb_info.y + "\nz:" + cb_info.z;
      textWidget.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...START_BUTTON,
      text: "START ACC",
      click_func: () => {
        logger.log("click to start acc");
        acc.start();
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...STOP_BUTTON,
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
