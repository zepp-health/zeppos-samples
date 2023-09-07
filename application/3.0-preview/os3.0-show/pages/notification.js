import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import * as notificationMgr from "@zos/notification";
import { BUTTON_H, BG_RECT, START_BUTTON, SERVICE_TEXT, SERVICE_BTN } from 'zosLoader:./style.[pf].layout.js'
import { replace } from "@zos/router";
import { DEVICE_HEIGHT } from './../libs/utils'

const BUTTON_Y = 250;
const BUTTON_MARGIN_TOP = 5;
const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

let thisFile = "pages/notification";

const logger = log.getLogger('notification.page')

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
      } else {
        // fill bg
        let btn_h = BUTTON_OY * notifications.length;
        let bg_h = BUTTON_Y + btn_h + Math.round(DEVICE_HEIGHT / 4);
        hmUI.createWidget(hmUI.widget.FILL_RECT, {
          ...BG_RECT,
          h: bg_h < DEVICE_HEIGHT ? DEVICE_HEIGHT : bg_h,
        });

        // list notifications
        notifications.forEach((b, i) => {
          hmUI.createWidget(hmUI.widget.BUTTON, {
            ...START_BUTTON,
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
          ...START_BUTTON,
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
      ...SERVICE_TEXT,
      text: "Click button to post \n a notification with 3 actions!",
    });

    // [Post Notification]
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...SERVICE_BTN,
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
