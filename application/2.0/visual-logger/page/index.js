/**
 * @info Visual Logger Showcase:
 * In these examples all dynamic output is done 
 * explicitly with a help of visual logger and without
 * hardcoding any additional widgets to visualize data
 */
import { getText } from "@zos/i18n";
import { createWidget, widget, prop } from "@zos/ui";
import * as styles from "./index.style";
import {
  SW_POS_Y,
  COLOR_RED_NORM,
  COLOR_GREEN_NORM,
  COLOR_BLUE_NORM,
} from "./index.const";

// Visual Logger
import { VisLog, hmUI } from "../shared/vis-log";
const vis = new VisLog("index.js");
// example: vis.log("Hello World!");

const txt_examples_top = [
  getText("txt.example1_top"),
  getText("txt.example2_top"),
  getText("txt.example3_top"),
  getText("txt.example4_top"),
  // ...
];
const txt_examples_bot = [
  getText("txt.example1_bot"),
  getText("txt.example2_bot"),
  getText("txt.example3_bot"),
  getText("txt.example4_bot"),
  // ...
];

const TOTAL_EXAMPLES = 4;
let current_example = 1;

let txt_top, txt_bot;
let slide_switch;
let slide_switch_last_state = true;
let btn_1, btn_2, btn_3;
let buttons_arr = [];

class IndexPage {
  init() {
    // ---------------------------------------------
    // stationary widgets
    // ---------------------------------------------
    const border_square = createWidget(widget.STROKE_RECT, {
      ...styles.BORDER_SQUARE,
    });

    const border_arc = createWidget(widget.ARC, {
      ...styles.ARC,
    });

    const btn_right = createWidget(widget.BUTTON, {
      ...styles.BTN_RIGHT,
      click_func: (button_widget) => {
        if (current_example < TOTAL_EXAMPLES) {
          current_example++;
        }
        this.onExampleChange(current_example);
        vis.log(getText("txt.btn_r_pressed"));
      },
    });

    const btn_left = createWidget(widget.BUTTON, {
      ...styles.BTN_LEFT,
      click_func: (button_widget) => {
        if (current_example > 1) {
          current_example--;
        }
        this.onExampleChange(current_example);
        vis.log(getText("txt.btn_l_pressed"));
      },
    });
    // ---------------------------------------------
    // dynamic widgets
    // ---------------------------------------------
    txt_top = createWidget(widget.TEXT, {
      ...styles.TXT_TOP,
      text: txt_examples_top[current_example - 1],
    });
    txt_bot = createWidget(widget.TEXT, {
      ...styles.TXT_BOT,
      text: txt_examples_bot[current_example - 1],
    });

    slide_switch = createWidget(widget.SLIDE_SWITCH, {
      ...styles.SWITCH,
      checked_change_func: (button_widget, checked) => {
        slide_switch_last_state = checked;
        this.onSwitchChange(checked);
      },
    });

    btn_1 = createWidget(widget.BUTTON, {
      ...styles.BTN_1,
      click_func: (button_widget) => {
        this.onButtonPress(1);
      },
    });

    btn_2 = createWidget(widget.BUTTON, {
      ...styles.BTN_2,
      click_func: (button_widget) => {
        this.onButtonPress(2);
      },
    });

    btn_3 = createWidget(widget.BUTTON, {
      ...styles.BTN_3,
      click_func: (button_widget) => {
        this.onButtonPress(3);
      },
    });

    buttons_arr.push(btn_1, btn_2, btn_3);
    this.setButtonsVisible(false);
    /* (!) init vis.log with a first message after all widgets
           were drawn on the screen, to stay on top of them */
    vis.log(getText("txt.welcome"));
    // alternative: vis.log("Welcome to VisLog!");
  }

  stop() {
    vis.log(getText("txt.destroy"));
  }

  setSwitchVisible(visible) {
    slide_switch.setProperty(prop.MORE, {
      ...styles.SWITCH,
      checked: slide_switch_last_state,
      y: visible ? SW_POS_Y : SW_POS_Y - 500,
    });
  }

  setButtonsVisible(visible) {
    for (let i = 0; i < buttons_arr.length; i++) {
      buttons_arr[i].setProperty(prop.VISIBLE, visible);
    }
  }

  setColorfulButtons(enable) {
    const buttonStyles = enable
      ? [styles.BTN_1_RED, styles.BTN_2_GREEN, styles.BTN_3_BLUE]
      : [styles.BTN_1, styles.BTN_2, styles.BTN_3];
    for (let i = 0; i < buttons_arr.length; i++) {
      buttons_arr[i].setProperty(prop.MORE, buttonStyles[i]);
    }
  }

  onExampleChange() {
    // text
    txt_top.setProperty(prop.MORE, {
      text: txt_examples_top[current_example - 1],
    });
    txt_bot.setProperty(prop.MORE, {
      text: txt_examples_bot[current_example - 1],
    });

    // set defaults
    this.setSwitchVisible(false);
    this.setButtonsVisible(false);
    this.setColorfulButtons(false);

    // example independent
    switch (current_example) {
      case 1:
      case 3: // Examples 1 and 3: show the switch
        this.setSwitchVisible(true);
        slide_switch.setProperty(prop.MORE, {
          ...styles.SWITCH,
          checked: true,
        });
        break;
      case 2: // Example 2: show the buttons 1...3
        this.setButtonsVisible(true);
        break;
      case 4: // Example 4: make sure VisLog is visible, show the buttons, make them colorful
        vis.updateSettings({ visual_log_enabled: true });
        this.setButtonsVisible(true);
        this.setColorfulButtons(true);
        break;
      default:
        break;
    }
  }

  onButtonPress(btn_id) {
    switch (current_example) {
      case 2:
        vis.info(getText("txt.btn_pressed"), btn_id);
        break;
      case 4: // change VisLog background to the applied color
        let str;
        if (btn_id == 1) {
          vis.updateSettings({
            background_color: COLOR_RED_NORM,
            text_color: 0xffffff, // white
            text_size: 16,
            line_count: 5,
          });
          str = getText("txt.red");
        } else if (btn_id == 2) {
          vis.updateSettings({
            background_color: COLOR_GREEN_NORM,
            text_color: 0x000000, // black
            text_size: 20, // larger font size
            line_count: 3, // reduce the line_count to fit the screen
          });
          str = getText("txt.green");
        } else if (btn_id == 3) {
          vis.updateSettings({
            background_color: COLOR_BLUE_NORM,
            text_color: 0xffffff,
            text_size: 16,
            line_count: 5,
          });
          str = getText("txt.blue");
        }
        vis.log(getText("txt.bg_color_set"), str);
        break;

      default:
        break;
    }
  }

  onSwitchChange(checked) {
    switch (current_example) {
      case 1: // Example 1: change VisLog on-screen position based on the switch
        const pos = checked ? getText("txt.top") : getText("txt.bot");
        vis.warn(getText("txt.logger_pos"), pos);
        vis.updateSettings({ log_from_top: checked });
        break;
      case 3: // Example 3: show/hide the VisLog
        vis.error(getText("txt.sw_logger"), checked);
        vis.updateSettings({ visual_log_enabled: checked });
        break;
      case 5:
        break;
      default:
        break;
    }
  }
}

Page({
  build() {
    this.indexPage = new IndexPage();
    this.indexPage.init();
  },
  onDestroy() {
    this.indexPage.stop();
  },
});
