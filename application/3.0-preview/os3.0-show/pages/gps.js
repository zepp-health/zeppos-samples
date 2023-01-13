import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";
import { Geolocation } from "@zos/sensor";

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

var gps = new Geolocation();
var text = null;

Page({
  onInit() {
    logger.log("page on init invoke");

    text = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y + BUTTON_H * 4,
      w: BUTTON_W,
      h: BUTTON_H,
      text_size: 18,
      text: "GPS Info Simulator sample value is referred from Los Angeles",
      color: 0x34e073,
    });

    gps.onChange(function (cb_info) {
      var latitude = `${cb_info.latitude.degrees}°${cb_info.latitude.minutes}.${cb_info.latitude.seconds}`;
      var longitude = `${cb_info.longitude.degrees}°${cb_info.longitude.minutes}.${cb_info.longitude.seconds}`;
      var show_text = "latitude: " + latitude + "\nlongitude: " + longitude;

      text.setProperty(hmUI.prop.TEXT, show_text);
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...START_BUTTON,
      text: "START GPS",
      click_func: () => {
        logger.log("click to start gps");
        gps.start();
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...STOP_BUTTON,
      text: "STOP GPS",
      click_func: () => {
        logger.log("click to stop gps");
        gps.stop();
      },
    });
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
    gps && gps.stop();
  },
});
