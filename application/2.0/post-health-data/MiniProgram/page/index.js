import { createWidget, widget, prop, align } from "@zos/ui";
import { Sleep, Time } from "@zos/sensor";
import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import { showToast } from "@zos/interaction";

import { DEFAULT_COLOR, DEFAULT_COLOR_TRANSPARENT } from "../utils/config";

const { width: DEVICE_WIDTH } = getDeviceInfo();

import { BasePage } from "@zeppos/zml/base/base-page";
import { pagePlugin } from "@zeppos/zml/2.0/module/messaging/plugin/page";

BasePage.use(pagePlugin);

Page(
  BasePage({
    state: {
      buttonWidgetGet: null,
      buttonWidgetPost: null,
      textWidget: null,
      sleepData: null,
      sleepInstance: null,
      timeInstance: null,
    },
    build() {
      this.state.buttonWidgetGet = createWidget(widget.BUTTON, {
        x: (DEVICE_WIDTH - px(400)) / 2,
        y: px(260),
        w: px(400),
        h: px(80),
        text_size: px(36),
        radius: px(12),
        normal_color: DEFAULT_COLOR,
        press_color: DEFAULT_COLOR_TRANSPARENT,
        text: "Get Sleep Data",
        click_func: (button_widget) => {
          this.getSleepData();
        },
      });
    },
    onCall(data) {
      console.log("data", data);
      this.responseCall(data);
    },
    getSleepData() {
      if (!this.state.sleepInstance) {
        this.state.sleepInstance = new Sleep();
        this.state.timeInstance = new Time();
      }

      const info = this.state.sleepInstance.getInfo();

      if (info?.score === undefined) {
        showToast({
          content: "No Sleep Data",
        });

        return false;
      }

      this.state.sleepData = {
        ...info,
        utc: this.state.timeInstance.getTime(),
      };

      const { score, deepTime, startTime, endTime, totalTime, utc } =
        this.state.sleepData;
      const text = `utc: ${utc}\nscore: ${score}\ndeepTime: ${deepTime}\nstartTime: ${startTime}\nendTime: ${endTime}\ntotalTime: ${totalTime}`;

      if (!this.state.textWidget) {
        this.state.textWidget = createWidget(widget.TEXT, {
          x: (DEVICE_WIDTH - px(400)) / 2,
          y: px(48),
          w: px(400),
          h: px(200),
          text_size: px(22),
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
          text,
          color: 0xffffff,
        });
      } else {
        this.state.textWidget.setProperty(prop.TEXT, text);
      }

      if (!this.state.buttonWidgetPost) {
        this.state.buttonWidgetPost = createWidget(widget.BUTTON, {
          x: (DEVICE_WIDTH - px(200)) / 2,
          y: px(360),
          w: px(200),
          h: px(80),
          text_size: px(36),
          radius: px(12),
          normal_color: DEFAULT_COLOR,
          press_color: DEFAULT_COLOR_TRANSPARENT,
          text: "Post Data",
          click_func: (button_widget) => {
            this.postSleepData();
          },
        });
      }
    },
    postSleepData() {
      console.log("device app post");

      this.request({
        type: "UPLOAD",
        params: {
          ...this.state.sleepData,
        },
      }).then((data) => {
        const { message } = data;

        showToast({ content: `UPLOAD ${message}` });
      });
    },
    responseCall(data) {
      const { type = "" } = data;

      if (type === "SETTINGS_APP_REQUEST_DATA") {
        this.getSleepData();

        this.request({
          type: "UPLOAD_DATA_SIDE_SERVICE",
          params: {
            ...this.state.sleepData,
          },
        }).then((data) => {
          const { message } = data;

          showToast({ content: `UPLOAD_DATA_SIDE_SERVICE ${message}` });
        });
      }
    },
  })
);
