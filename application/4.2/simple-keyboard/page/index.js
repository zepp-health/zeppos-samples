import {
  keyboard,
  createWidget,
  widget,
  createKeyboard,
  deleteKeyboard,
  inputType,
  align,
  text_style,
  deleteWidget,
  updateLayout,
} from "@zos/ui";

import { showToast } from "@zos/interaction";
import { scrollTo } from "@zos/page";

import { exit } from "@zos/router";

class Ref {
  constructor(val) {
    this.current = val;
  }
}

function ref(val) {
  return new Ref(val);
}

function createElement(id, opts) {
  let { ref, layout_parent, parent, ...rest } = opts;

  if (layout_parent instanceof Ref) {
    rest.parent = layout_parent.current;
  } else {
    rest.parent = layout_parent;
  }

  parent = parent instanceof Ref ? parent.current : parent ?? { createWidget };
  const ele = parent.createWidget(id, rest);
  ele.parent = parent;

  if (ref) {
    ref.current = ele;
  }

  return ele;
}

const text1_style = {
  color: 0xffffff,
  align_v: align.CENTER_V,
  align_h: align.CENTER_H,
  text_style: text_style.CHAR_WRAP,
};

Page({
  state: {
    isEnabled: keyboard.isEnabled(),
    isSelected: keyboard.isSelected(),
    vc: null,
  },
  onInit() {},
  onPause() {
    console.log("puase");
  },
  onResume() {
    console.log("resume");
    this.state.isEnabled = keyboard.isEnabled();
    this.state.isSelected = keyboard.isSelected();

    this.clearScreen();
    this.build();
    this.do_layout();
    this.scroll_to_top();
  },
  scroll_to_top() {
    scrollTo({
      y: 0,
    });
  },
  do_layout() {
    if (this.state.vc && this.state.vc.current) {
      const ele = this.state.vc.current;
      updateLayout(ele);
    }
  },
  clearScreen() {
    if (this.state.vc && this.state.vc.current) {
      const ele = this.state.vc.current;
      const items = ele.layoutChildren;
      deleteWidget(ele);
      items.forEach((item) => {
        deleteWidget(item);
      });
      this.state.vc.current = null;
    }
  },
  build() {
    if (!this.state.isEnabled) {
      this.build_enable_page();
      return;
    } else if (!this.state.isSelected) {
      this.build_select_page();
      return;
    } else {
      this.build_setting_page();
    }
  },
  build_enable_page() {
    const vc = ref(null);
    this.state.vc = vc;
    [
      [
        widget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: "25",
            padding_top: "40",
            padding_left: "72",
            padding_right: "72",
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: "Enable Pinyin Keyboard",
          ...text1_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: "40",
          },
        },
      ],
      [
        widget.IMG,
        {
          src: "image/keyboard_setting.png",
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "126",
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: "Please toggle Pinyin Keyboard on in settings",
          ...text1_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: "36",
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Go to Settings",
          normal_color: 0x383838,
          press_color: 0x383838,
          click_func() {
            keyboard.gotoSettings();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "88",
            font_size: "36",
            corner_radius: "44",
          },
        },
      ],
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "100",
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },
  build_select_page() {
    const vc = ref(null);
    this.state.vc = vc;
    [
      [
        widget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: "25",
            padding_top: "40",
            padding_left: "72",
            padding_right: "72",
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: "Enable Pinyin Keyboard",
          ...text1_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: "40",
          },
        },
      ],
      [
        widget.IMG,
        {
          src: "image/keyboard_enable.png",
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "126",
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: "Touch and hold the Globe key on the keyboard, then select Pinyin keyboard",
          ...text1_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            min_height: "100",
            height: "auto",
            font_size: "36",
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: 0x383838,
          press_color: 0x383838,
          click_func: () => {
            this.keyboard(() => {
              this.onResume()
            });
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "88",
            font_size: "36",
            corner_radius: "44",
          },
        },
      ],
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "100",
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },
  build_setting_page() {
    const vc = ref(null);
    this.state.vc = vc;

    showToast({
      content: "You're all set",
    });

    [
      [
        widget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            left: "0",
            top: "0",
            width: "100vw",
            height: "300vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: "10",
            padding_top: "40",
            padding_left: "72",
            padding_right: "72",
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: "Pinyin Keyboard",
          ...text1_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: "40",
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: 0x383838,
          press_color: 0x383838,
          click_func: () => {
            this.keyboard();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "88",
            font_size: "36",
            corner_radius: "44",
          },
        },
      ],
      ...[
        "Languages",
        "Layout",
        "Themes",
        "Sound & vibration",
        "Privacy",
        "About",
      ].map((i) => {
        return [
          widget.BUTTON,
          {
            text: i,
            normal_color: 0x383838,
            press_color: 0x383838,
            click_func() {
              showToast({
                content: i,
              });
            },
            layout_parent: vc,
            layout: {
              width: "100%",
              height: "88",
              font_size: "36",
              corner_radius: "44",
            },
          },
        ];
      }),
      [
        widget.BUTTON,
        {
          text: "Exit",
          normal_color: 0x383838,
          press_color: 0x383838,
          click_func() {
            exit();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "88",
            font_size: "36",
            corner_radius: "44",
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },

  keyboard(cb) {
    createKeyboard({
      onComplete: (kb, result) => {
        console.log("complete");
        deleteKeyboard();
        showToast({
          content: "Input: " + result.data,
        });
        cb && cb();
      },
      onCancel: () => {
        console.log("cancel");
        deleteKeyboard();
        cb && cb();
      },
    });
  },
});
