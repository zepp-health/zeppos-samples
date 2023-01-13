import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log as logger } from "@zos/utils";
import * as notificationMgr from "@zos/notification";
import { replace } from "@zos/router";

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

let thisFile = "pages/notification";

Page({
  onInit() {
    logger.log("page on init invoke");
  },
  build() {
    // Send a notification
    function sendNotification() {
      notificationMgr.notify({
        title: "This is title",
        content: "This is content ...",
        actions: [
          {
            text: "Home Page",
            file: "pages/index",
          },
          {
            text: "GO1",
            file: "pages/target",
            param: "GO1 button Clicked",
          },
          {
            text: "GO2",
            file: "pages/target",
            param: "GO2 button Clicked",
          },
        ],
      });
    }

    function listNotificationList() {
      let notifications = notificationMgr.getAllNotifications();
      if (notifications.length == 0) {
        // // no notification
        // hmUI.createWidget(hmUI.widget.TEXT, {
        //   ...INFO_TEXT,
        //   text: `No notification!`,
        // });
      } else {
        // fill bg
        let btn_h = BUTTON_OY * notifications.length;
        let bg_h = BUTTON_Y + btn_h + Math.round(DEVICE_HEIGHT / 4);
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...BG_RECT,
          h: bg_h < DEVICE_HEIGHT ? DEVICE_HEIGHT : bg_h,
        });
        // // show count
        // hmUI.createWidget(hmUI.widget.TEXT, {
        //   ...INFO_TEXT,
        //   y: BUTTON_Y - 80,
        //   text: `Notification count: ${notifications.length}\n Click to delete`,
        // });
        // list notifications
        notifications.forEach((b, i) => {
          hmUI.createWidget(hmUI.widget.BUTTON, {
            ...BUTTON,
            y: BUTTON_Y + BUTTON_OY * i,
            text: `Notification ${b}`,
            click_func: () => {
              notificationMgr.cancel(b);
              replace({ url: `${thisFile}` });
            },
          });
        });

        // delete all
        hmUI.createWidget(hmUI.widget.BUTTON, {
          ...BUTTON,
          y: BUTTON_Y + BUTTON_OY * notifications.length,
          text: `Delete All`,
          click_func: () => {
            notificationMgr.cancel(notifications);
            replace({ url: `${thisFile}` });
          },
        });
      }
    } // end listNotificationList()

    // List notification list items
    listNotificationList();

    // Show tips
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80,
      w: DEVICE_WIDTH - 40 * 2,
      h: 80,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: "Click button to post \n a notification with 3 actions!",
    });

    // [Post Notification]
    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 100,
      y: 180,
      w: DEVICE_WIDTH - 100 * 2,
      h: 50,
      radius: 8,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: "Post Notification",
      click_func: function (button) {
        sendNotification();
      },
    });

    // Show scrollbar
    hmUI.createWidget(hmUI.widget.PAGE_SCROLLBAR, {
      // color : 123456,
      // bg_color : 654321,
    });
  }, // end build
  onPause() {
    logger.log("page on pause invoke");
  },
  onResume() {
    logger.log("page on resume invoke");
    replace({ url: `${thisFile}` });
  }, // end onResume
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
