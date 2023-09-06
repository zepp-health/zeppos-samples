import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Compass } from "@zos/sensor";

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

const compass = new Compass();
let text = null;
const logger = log.getLogger('compass.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 3,
      w: BUTTON_W,
      h: BUTTON_H * 3,
      text_size: 18,
      text: "Compass Info simulator value from 0 degree to 360 degree",
      color: 0x34e073,
    });

    compass.onChange(function () {
      let show_text = "compass info:";
      show_text += "\ndirection_angle:" + compass.getDirectionAngle();
      show_text += "\ndirection:" + compass.getDirection();
      text.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...START_BUTTON,
      text: "START COMPASS",
      click_func: () => {
        logger.log("click to start compass");
        compass.start();
        if (!compass.calibration_status) {
          text.setProperty(
            hmUI.prop.TEXT,
            "please enter compass apps to calibrate"
          );
        }
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...STOP_BUTTON,
      text: "STOP COMPASS",
      click_func: () => {
        logger.log("click to stop compass");
        compass.stop();
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
    compass && compass.stop();
  },
});
