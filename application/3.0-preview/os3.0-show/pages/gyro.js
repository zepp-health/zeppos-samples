import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";
import { Gyroscope } from "@zos/sensor";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

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


var gyro = new Gyroscope();
var text = null;

Page({
  onInit() {
    logger.log("page on init invoke");

    text = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 4,
      w: BUTTON_W,
      h: BUTTON_H * 2,
      text_size: 18,
      text: "GYRO Info simulator sample value is from horizontal to vertical",
      color: 0x34e073,
    });

    gyro.onChange(hmSensor.event.CHANGE, function (cb_info) {
      var show_text =
        "gryo info\nx:" + cb_info.x + "\ny:" + cb_info.y + "\nz:" + cb_info.z;
      text.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...START_BUTTON,
      text: "START GYRO",
      click_func: () => {
        logger.log("click to start gyro");
        gyro.start();
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...STOP_BUTTON,
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
