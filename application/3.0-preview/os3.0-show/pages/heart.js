import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";
import { HeartRate } from "@zos/sensor";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

const BUTTON_X = 50;
const BUTTON_Y = 70;
const BUTTON_W = DEVICE_WIDTH - 2 * BUTTON_X;
const BUTTON_H = 50;
const BUTTON_MARGIN_TOP = 20;
const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

const BUTTON = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: 16,
};

var info = null;
var scene = 23;
var text_info = null;
var show_text = "";
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 4,
      w: BUTTON_W,
      h: BUTTON_H * 2,
      text_size: 18,
      text: "max heart rate info:",
      color: 0x34e073,
    });

    let hrSr = new HeartRate()

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X,
      y: BUTTON_Y + 100,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
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
