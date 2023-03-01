import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { BloodOxygen } from "@zos/sensor";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } =
  getDeviceInfo();

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

const logger = log.getLogger('spo2.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 2,
      w: (DEVICE_WIDTH * 2) / 3,
      h: BUTTON_H * 6,
      text_size: 15,
      text: "spo2 record info:",
      color: 0x34e073,
    });

    let spo2Sr = new BloodOxygen();

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X,
      y: BUTTON_Y + 50,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
      text: "getMaxRecord",
      click_func: () => {
        show_text = "";
        let record = spo2Sr.getLastFewHour(2);
        if (record != undefined) {
          for (let item of record) {
            let d = new Date(item.time * 1000);
            show_text +=
              "time: " + d.toLocaleString() + ", value:" + item.spo2 + "\n";
            logger.log("time ", item.time, " spo2 ", item.spo2);
          }
          text_info.setProperty(hmUI.prop.TEXT, show_text);
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
