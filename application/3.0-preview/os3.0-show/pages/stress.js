import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Stress } from "@zos/sensor";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

const BUTTON_X = 25;
const BUTTON_Y = 70;
const BUTTON_W = (DEVICE_WIDTH * 10) / 25;
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

const logger = log.getLogger('stress.page')
Page({
  onInit() {
    logger.log("page on init invoke");

    text_info = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 50,
      y: BUTTON_Y + BUTTON_H * 4,
      w: DEVICE_WIDTH,
      h: BUTTON_H * 6,
      text_size: 15,
      text: "stress record info:",
      color: 0x34e073,
    });

    let stressSr = new Stress();

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X,
      y: BUTTON_Y + 50,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
      text: "All Day Stress",
      click_func: () => {
        show_text = "";
        let allday = stressSr.getToday();
        if (allday != undefined) {
          logger.log("All Day Stress: ");
          for (let item of allday) {
            if (item != undefined) {
              start_hour = parseInt(item.minute / 60);
              start_minute = parseInt(item.minute % 60);

              show_text +=
                "time: " +
                start_hour +
                ":" +
                start_minute +
                " stress val:" +
                item.stress +
                "\n";
            }

            text_info.setProperty(hmUI.prop.TEXT, show_text);
          }
        }
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X + DEVICE_WIDTH / 2,
      y: BUTTON_Y + BUTTON_H,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
      text: "All 24 hours Stress",
      click_func: () => {
        show_text = "";
        let allHours = stressSr.getTodayByHour();
        if (allHours != undefined) {
          for (let index = 0; index < allHours.length; index++) {
            if (allHours[index] != 0) {
              start_hour = parseInt(allHours[index].minute / 60);
              start_minute = parseInt(allHours[index].minute % 60);

              show_text +=
                "hour: " + index + " stress val:" + allHours[index] + "\n";
            }

            text_info.setProperty(hmUI.prop.TEXT, show_text);
          }
        }
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X + DEVICE_WIDTH / 2,
      y: BUTTON_Y + BUTTON_H * 2 + 10,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
      text: "All 7 days Stress",
      click_func: () => {
        show_text = "";
        let all7DaysHours = stressSr.getLastWeek();
        if (all7DaysHours != undefined) {
          for (let index = 0; index < all7DaysHours.length; index++) {
            if (all7DaysHours[index].stress != 0) {
              let d = new Date(all7DaysHours[index].second * 1000);
              show_text +=
                "date: " +
                d.toLocaleString() +
                " stress val:" +
                all7DaysHours[index].stress +
                "\n";
            }

            text_info.setProperty(hmUI.prop.TEXT, show_text);
          }
        }
      },
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: BUTTON_X,
      y: BUTTON_Y + BUTTON_H * 2 + 10,
      w: BUTTON_W,
      h: BUTTON_H,
      press_color: 10066329,
      normal_color: 3355443,
      radius: 16,
      text: "getDailyAverage",
      click_func: () => {
        show_text = "";
        let allDays = stressSr.getLastWeekByHour();
        if (allDays != undefined) {
          for (let index = 0; index < allDays.length; index++) {
            if (allDays[index] != 0) {
              show_text +=
                "day: " + index + " stress val:" + allDays[index] + "\n";
            }

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
