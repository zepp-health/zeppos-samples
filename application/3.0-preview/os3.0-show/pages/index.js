import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { push } from "@zos/router";
import * as Styles from 'zosLoader:./style.[pf].layout.js'
import { createEmptySpace } from './../components/empty-space'

const logger = log.getLogger('index.page')

Page({
  onCreate(e) {
    logger.log("app on create invoke");
  },
  onInit() {
    logger.log("page on init invoke");
  },
  onShow() {
    logger.log("page on show invoke");
  },
  build() {
    hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.MAIN_TITLE_STYLE,
      text: "New Feature\nWelcome to Zepp OS 3.0",
    });

    const featureArray = [
      { name: "BG Service", url: "pages/bgService"},
      { name: "Notification", url: "pages/notification"},
      { name: "Alarm", url: "pages/alarm"},
      { name: "Screen", url: "pages/screen"},
      { name: "Canvas", url: "pages/canvas"},
      { name: "Health", url: "pages/sensor"}
    ]
    featureArray.forEach((feature, index) => {
      hmUI.createWidget(hmUI.widget.BUTTON, {
        ...Styles.MAIN_BUTTON,
        y: Styles.MAIN_BUTTON_Y + Styles.MAIN_BUTTON_OY * index,
        text: feature.name,
        click_func: function (button) {
          push({
            url: feature.url,
          });
        },
      });
    })

    createEmptySpace(Styles.MAIN_BUTTON_Y + Styles.MAIN_BUTTON_OY * featureArray.length)
  },
  onHide() {
    logger.log("page on hide invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
