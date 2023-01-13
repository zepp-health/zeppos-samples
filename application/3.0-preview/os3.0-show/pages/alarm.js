import { getDeviceInfo } from "@zos/device";
import { log } from '@zos/utils'
import hmUI from '@zos/ui'
import { push, replace } from "@zos/router";
import * as alarmMgr from '@zos/alarm'

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

const BUTTON_X = 50;
const BUTTON_Y = 250;
const BUTTON_W = DEVICE_WIDTH - 2 * BUTTON_X;
const BUTTON_H = 40;
const BUTTON_MARGIN_TOP = 5;
const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

const BUTTON = {
  x: BUTTON_X,
  // y: BUTTON_Y,
  w: BUTTON_W,
  h: BUTTON_H,
  press_color: 10066329,
  normal_color: 3355443,
  radius: 16,
};
const BG_RECT = {
  x: 0,
  y: 0,
  w: DEVICE_WIDTH,
  color: 0x000000,
};
const INFO_TEXT = {
  x: BUTTON_X,
  y: BUTTON_Y,
  w: BUTTON_W,
  h: DEVICE_HEIGHT - 2 * BUTTON_Y,
  align_h: hmUI.align.CENTER_H,
  color: 0xff0000,
  text_size: 24,
  // text: `string content`,
};

let thisFile = "pages/alarm";

Page({
  onInit() {
    log.log("page on init invoke");
  },
  build() {
    function listAlarms() {
      let alarms = alarmMgr.getAllAlarms();
      if (alarms.length == 0) {
        // // no alarm
        // hmUI.createWidget(hmUI.widget.TEXT, {
        //   ...INFO_TEXT,
        //   text: `No alarm!`,
        // });
      } else {
        // fill bg
        let btn_h = BUTTON_OY * alarms.length;
        let bg_h = BUTTON_Y + btn_h + Math.round(DEVICE_HEIGHT / 4);
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...BG_RECT,
          h: bg_h < DEVICE_HEIGHT ? DEVICE_HEIGHT : bg_h,
        });
        // // show count
        // hmUI.createWidget(hmUI.widget.TEXT, {
        //   ...INFO_TEXT,
        //   y: BUTTON_Y - 80,
        //   text: `Alarm count: ${alarms.length}\n Click to cancel `,
        // });
        // list alarms
        alarms.forEach((b, i) => {
          hmUI.createWidget(hmUI.widget.BUTTON, {
            ...BUTTON,
            y: BUTTON_Y + BUTTON_OY * i,
            text: `Alarm ${b}`,
            click_func: () => {
              alarmMgr.cancel(b);
              replace({
                url: `${thisFile}`,
                params: `${thisFile}`,
              });
            },
          });
        });
      }
    } // end listAlarms()

    // List notification list items
    listAlarms();

    // Show tips
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80,
      w: DEVICE_WIDTH - 40 * 2,
      h: 80,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: "Click button to setup \n more alarms!",
    });

    // [setup new alarm]
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 100,
      y: 180,
      w: DEVICE_WIDTH - 100 * 2,
      h: 50,
      radius: 8,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: "Setup new alarm",
      click_func: function (button) {
        push({
          url: "pages/newAlarm",
        });
      },
    });

    // Show scrollbar
    hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR, {});
  },
  onDestroy() {
    log.log("page on destroy invoke");
  },
});
