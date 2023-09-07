import hmUI from "@zos/ui";
import { px } from '@zos/utils'
import { log } from "@zos/utils";
import * as alarmMgr from '@zos/alarm'
import { onGesture, offGesture, GESTURE_RIGHT } from "@zos/interaction";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from './../libs/utils'

const FULL_SCREEN = {
  x: 0,
  y: 0,
  w: DEVICE_WIDTH,
  h: DEVICE_HEIGHT,
};

const BUTTON_H = px(40);
const BUTTON_MARGIN_TOP = 5;
const BUTTON_OY = BUTTON_H + BUTTON_MARGIN_TOP;

let thisFile = "pages/newAlarm";
let dateTime = new Date();
dateTime.setMinutes(dateTime.getMinutes() + 5);
let date_text = null;
let time_text = null;
let repeat_text = null;
let period_text = null;
let duration_text = null;
let vc = null;
const repeatTypeArray = [
  "ONCE",
  "MINUTE",
  "HOUR",
  "DAY",
  "WEEK",
  "MONTH",
  "YEAR",
];
let alarmObj = {
  url: "pages/target",
  param: "alarm time due!",
  //time: dateTime.UTC()/1000,
  store: true,
  repeat_type: alarmMgr.REPEAT_ONCE,
  repeat_period: 1,
  repeat_duration: 1,
  week_days: 0,
  start_time: 0,
  end_time: 0,
};
let alarmBtn = null;

const logger = log.getLogger('create-alarm.page')

Page({
  onInit() {
    onGesture(function (event) {
      switch (event) {
        case GESTURE_RIGHT:
          if (vc) {
            //! in dialog
            return true;
          }
        default:
          break;
      }
      return false;
    });
  },
  build() {
    function setupAlarm() {
      alarmObj.time = Math.floor(dateTime.getTime() / 1000);
      // if (alarmObj.repeat_type == hmApp.repeat_type.ONCE) {
      //     alarmObj.start_time = 0;
      //     alarmObj.end_time = 0;
      // }
      // check more params
      console.log('********', JSON.stringify(alarmObj))
      let id = alarmMgr.set(alarmObj);
      logger.log('alarm= > %d', id)
      refreshSetup(id == 0 ? "failed" : id);
    }

    function hideDialog() {
      hmUI.deleteWidget(vc), (vc = null);
      hmUI.redraw();
      refreshSetup();
    }

    function refreshSetup(alarmId) {
      logger.log('alarmBtn', typeof alarmBtn.setProperty)
      if (alarmId === undefined)
        alarmBtn.setProperty(hmUI.prop.TEXT, `Setup Alarm`);
      else alarmBtn.setProperty(hmUI.prop.TEXT, `Setup Alarm (${alarmId})`);
    }

    function refreshDate() {
      date_text.setProperty(
        hmUI.prop.TEXT,
        `${dateTime.getFullYear()}-${dateTime.getMonth() + 1
        }-${dateTime.getDate()}`
      );
    }

    function refreshTime() {
      time_text.setProperty(
        hmUI.prop.TEXT,
        `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`
      );
    }

    function refreshRepeatType() {
      repeat_text.setProperty(
        hmUI.prop.TEXT,
        repeatTypeArray[alarmObj.repeat_type]
      );
    }
    function refreshRepeatPeriod() {
      period_text.setProperty(hmUI.prop.TEXT, `${alarmObj.repeat_period}`);
    }
    function refreshRepeatDuration() {
      duration_text.setProperty(hmUI.prop.TEXT, `${alarmObj.repeat_duration}`);
    }

    function datePickerCb(picker, event_type, column, value_index) {
      logger.log(
        "timePickerCb: " + event_type,
        "column: " + column,
        "value_index: " + value_index
      );
      if (event_type == 1) {
        // update
        switch (column) {
          case 0: // month
            dateTime.setMonth(value_index); // 0~11
            break;
          case 1: // day
            dateTime.setDate(value_index + 1); // 1~31
            break;
          case 2: // year
            dateTime.setFullYear(value_index + 1970);
            break;
        }
      } else if (event_type == 2) {
        // done
        refreshDate();
        hideDialog();
      }
    }

    function selectDate() {
      vc = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        scroll_enable: 0,
      });
      vc.createWidget(hmUI.widget.WIDGET_PICKER, {
        title: "Pick Date",
        nb_of_columns: 3,
        data_config: [
          {
            data_array: new Array(12).fill(0).map((d, index) => index + 1),
            init_val_index: dateTime.getMonth(),
          },
          {
            data_array: new Array(31).fill(0).map((d, index) => index + 1),
            init_val_index: dateTime.getDate() - 1,
          },
          {
            data_array: new Array(100).fill(0).map((d, index) => index + 1970),
            init_val_index: dateTime.getFullYear() - 1970,
          },
        ],
        picker_cb: datePickerCb,
      });
    } // end selectDate

    function timePickerCb(picker, event_type, column, value_index) {
      logger.log(
        "timePickerCb: " + event_type,
        "column: " + column,
        "value_index: " + value_index
      );
      if (event_type == 1) {
        // update
        switch (column) {
          case 0: // hour
            dateTime.setHours(value_index);
            break;
          case 1: // minute
            dateTime.setMinutes(value_index);
            break;
          case 2: // second
            dateTime.setSeconds(value_index);
            break;
        }
      } else if (event_type == 2) {
        // done
        refreshTime();
        hideDialog();
      }
    } // end timePickerCb

    function selectTime() {
      vc = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        scroll_enable: 0,
      });
      vc.createWidget(hmUI.widget.WIDGET_PICKER, {
        title: "Pick Time",
        nb_of_columns: 3,
        data_config: [
          {
            data_array: new Array(24).fill(0).map((d, index) => index),
            init_val_index: dateTime.getHours(),
          },
          {
            data_array: new Array(60).fill(0).map((d, index) => index),
            init_val_index: dateTime.getMinutes(),
          },
          {
            data_array: new Array(60).fill(0).map((d, index) => index),
            init_val_index: dateTime.getSeconds(),
          },
        ],
        picker_cb: timePickerCb,
      });
    } // end selectTime

    function repeatTypePickerCb(picker, event_type, column, value_index) {
      logger.log(
        "timePickerCb: " + event_type,
        "column: " + column,
        "value_index: " + value_index
      );
      if (event_type == 1) {
        // update
        switch (column) {
          case 0:
            alarmObj.repeat_type = value_index;
            break;
        }
      } else if (event_type == 2) {
        // done
        refreshRepeatType();
        hideDialog();
      }
    } // end timePickerCb

    function selectRepeatType() {
      vc = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
        x: 0,
        y: 0,
        w: DEVICE_WIDTH,
        h: DEVICE_HEIGHT,
        scroll_enable: 0,
      });
      vc.createWidget(hmUI.widget.WIDGET_PICKER, {
        title: "Repeat Type",
        nb_of_columns: 1,
        data_config: [
          {
            // hmApp.repeat_type.*
            data_array: repeatTypeArray,
            init_val_index: alarmObj.repeat_type,
            support_loop: true,
            font_size: px(32),
            select_font_size: px(32),
            col_width: px(120),
          },
        ],
        picker_cb: repeatTypePickerCb,
      });
    } // end selectRepeatType

    function inputRepeatPeriod() {
      let initNum = alarmObj.repeat_period; // FIXME
      vc = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
        ...FULL_SCREEN,
        scroll_enable: 0,
      });
      vc.createWidget(hmUI.widget.FILL_RECT, { ...FULL_SCREEN, color: 0 });
      function pressCb(keyboard, id, value, mode) {
        logger.log(`id:${id} value:${value} mode:${mode}`);
        if (id == 11) {
          // done
          hideDialog();
          alarmObj.repeat_period = initNum;
          refreshRepeatPeriod();
        } else if (id == 3) {
          // backspace
          initNum = Math.round(initNum / 10 - 0.5);
          keyboard.setProperty(hmUI.prop.TEXT, `${initNum}`);
        } else {
          let num = value - 48; // ASCII code of number
          initNum = initNum * 10 + num;
          keyboard.setProperty(hmUI.prop.TEXT, `${initNum}`);
        }
      }
      let kb = vc.createWidget(hmUI.widget.KEYBOARD, { click_func: pressCb });
      kb.setProperty(hmUI.prop.KEY_PARA, { id: 11, text: "OK" });
      kb.setProperty(hmUI.prop.TEXT, `${initNum}`);
    } // end inputRepeatPeriod

    function inputRepeatDuration() {
      let initNum = alarmObj.repeat_duration; // FIXME
      vc = hmUI.createWidget(hmUI.widget.VIEW_CONTAINER, {
        ...FULL_SCREEN,
        scroll_enable: 0,
      });
      vc.createWidget(hmUI.widget.FILL_RECT, { ...FULL_SCREEN, color: 0 });
      function pressCb(keyboard, id, value, mode) {
        logger.log(`id:${id} value:${value} mode:${mode}`);
        if (id == 11) {
          // done
          hideDialog();
          alarmObj.repeat_duration = initNum;
          refreshRepeatDuration();
        } else if (id == 3) {
          // backspace
          initNum = Math.round(initNum / 10 - 0.5);
          keyboard.setProperty(hmUI.prop.TEXT, `${initNum}`);
        } else {
          let num = value - 48; // ASCII code of number
          initNum = initNum * 10 + num;
          keyboard.setProperty(hmUI.prop.TEXT, `${initNum}`);
        }
      }
      let kb = vc.createWidget(hmUI.widget.KEYBOARD, { click_func: pressCb });
      kb.setProperty(hmUI.prop.KEY_PARA, { id: 11, text: "OK" });
      kb.setProperty(hmUI.prop.TEXT, `${initNum}`);
    } // end inputRepeatDuration

    // Time ...
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(60),
      y: px(80),
      w: px(100),
      h: px(40),
      text_size: px(24),
      align_h: hmUI.align.LEFT,
      color: 0xffffff,
      text: "Time:",
      enable: false,
    });
    date_text = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(150),
      y: px(80),
      w: px(100),
      h: px(40),
      radius: 4,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: `...`,
      click_func: function (button) {
        // dialog
        selectDate();
      },
    });
    refreshDate();

    time_text = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(280),
      y: px(80),
      w: px(100),
      h: px(40),
      radius: 4,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: `...`,
      click_func: function (button) {
        selectTime();
      },
    });
    refreshTime();

    // File ...
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(60),
      y: px(80) + BUTTON_OY,
      w: px(300),
      h: px(40),
      text_size: px(24),
      align_h: hmUI.align.LEFT,
      color: 0xffffff,
      text: "URL:  pages/target",
      enable: false,
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(60),
      y: px(80) + BUTTON_OY * 2,
      w: px(300),
      h: px(40),
      text_size: px(24),
      align_h: hmUI.align.LEFT,
      color: 0xffffff,
      text: "repeat_type:",
      enable: false,
    });
    repeat_text = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(250),
      y: px(80) + BUTTON_OY * 2,
      w: px(100),
      h: px(40),
      radius: 4,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: `...`,
      click_func: function (button) {
        selectRepeatType();
      },
    });
    refreshRepeatType();

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(60),
      y: px(80) + BUTTON_OY * 3,
      w: px(300),
      h: px(40),
      text_size: px(24),
      align_h: hmUI.align.LEFT,
      color: 0xffffff,
      text: "repeat_duration:",
      enable: false,
    });
    duration_text = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(250),
      y: px(80) + BUTTON_OY * 3,
      w: px(100),
      h: px(40),
      radius: 4,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: `...`,
      click_func: function (button) {
        inputRepeatDuration();
      },
    });
    refreshRepeatDuration();

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(60),
      y: px(80) + BUTTON_OY * 4,
      w: px(300),
      h: px(40),
      text_size: px(24),
      align_h: hmUI.align.LEFT,
      color: 0xffffff,
      text: "repeat_period:",
      enable: false,
    });
    period_text = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(250),
      y: px(80) + BUTTON_OY * 4,
      w: px(100),
      h: px(40),
      radius: 4,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: `...`,
      click_func: function (button) {
        inputRepeatPeriod();
      },
    });
    refreshRepeatPeriod();

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: px(60),
      y: px(80) + BUTTON_OY * 5,
      w: px(300),
      h: px(40),
      text_size: px(24),
      align_h: hmUI.align.LEFT,
      color: 0xffffff,
      text: "store:",
      enable: false,
    });

    hmUI.createWidget(hmUI.widget.SLIDE_SWITCH, {
      x: px(250),
      y: px(80) + BUTTON_OY * 5,
      checked: alarmObj.store,
      checked_change_func: (slideSwitch, checked) => {
        logger.log("=== alarm store: " + checked);
        alarmObj.store = checked;
        // refreshSetup();
      },
    });

    alarmBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: px(100),
      y: px(100) + BUTTON_OY * 6,
      w: DEVICE_WIDTH - px(100) * 2,
      h: px(40),
      radius: 4,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: `Setup Alarm`,
      click_func: function (button) {
        setupAlarm();
      },
    });
  },
  onDestroy() {
    offGesture()
  },
});
