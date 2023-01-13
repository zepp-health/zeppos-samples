import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";
import { Sleep } from "@zos/sensor";

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
      h: BUTTON_H,
      text_size: 15,
      text: "Sleep Sensor Function Info:",
      color: 0x34e073,
    });

    let sleepSr = new Sleep();

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X,
      y: BUTTON_Y,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
      text: "Is sleeping ?",
      click_func: () => {
        let sleeping = sleepSr.getIsSleeping();

        hmUI.showToast({ text: `${sleeping}` });
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X,
      y: BUTTON_Y + 100,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
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
