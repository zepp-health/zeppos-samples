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
  setStatusBarVisible,
} from "@zos/ui";

import { showToast } from "@zos/interaction";
import { scrollTo } from "@zos/page";
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from "@zos/device";
import { exit } from "@zos/router";
import { getPackageInfo } from "@zos/app";

const device_info = getDeviceInfo();
const appName = getPackageInfo().name;

class Ref {
  constructor(val) {
    this.current = val;
  }
}

function ref(val) {
  return new Ref(val);
}

function createElement(id, opts) {
  let { ref, layout_parent, parent, children, ...rest } = opts;

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

  if (children) {
    children.forEach(([id, opts]) => {
      if (ele.getType() === widget.VIRTUAL_CONTAINER) {
        opts.layout_parent = ele;
      } else if (
        [widget.GROUP, widget.VIEW_CONTAINER].includes(ele.getType()) &&
        ele.isAutoLayout
      ) {
        opts.layout_parent = ele;
      }

      if ([widget.GROUP, widget.VIEW_CONTAINER].includes(ele.getType())) {
        opts.parent = ele;
      } else {
        opts.parent = ele.parent;
      }
      createElement(id, opts);
    });
  }

  return ele;
}

function removeElement(ele) {
  if (ele.getType() === widget.VIRTUAL_CONTAINER) {
    const children = ele.layoutChildren;
    deleteWidget(ele);
    children.forEach((item) => {
      removeElement(item);
    });
  } else {
    deleteWidget(ele);
  }
}

function default_theme() {
  if (device_info.screenShape === SCREEN_SHAPE_SQUARE) {
    setStatusBarVisible(false);
  }
}

const default_text_style = {
  color: 0xffffff,
  align_v: align.CENTER_V,
  align_h: align.CENTER_H,
  text_style: text_style.CHAR_WRAP,
};

const default_layout = {
  tags: "sww",
};

Page({
  state: {
    isEnabled: keyboard.isEnabled(),
    isSelected: keyboard.isSelected(),
    vc: null,
  },
  onInit() {
    default_theme();
  },
  build() {
    if (!this.state.isEnabled) {
      this.build_enable_page();
    } else if (!this.state.isSelected) {
      this.build_select_page();
    } else {
      this.build_setting_page();
    }
  },
  onPause() {
    console.log("pause");
  },
  onResume() {
    console.log("resume");
    this.state.isEnabled = keyboard.isEnabled();
    this.state.isSelected = keyboard.isSelected();

    this.clear_page();
    this.build();
    this.refresh_layout();
    this.scroll_to_top();
  },
  scroll_to_top() {
    scrollTo({
      y: 0,
    });
  },
  refresh_layout() {
    if (this.state.vc && this.state.vc.current) {
      const ele = this.state.vc.current;
      updateLayout(ele);
    }
  },
  clear_page() {
    if (this.state.vc && this.state.vc.current) {
      const ele = this.state.vc.current;
      removeElement(ele);
      this.state.vc.current = null;
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
            ...default_layout,
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column",
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
          text: `Enable ${appName}`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: "100%",
            height: "auto",
            font_size: "40",
          },
        },
      ],
      [
        widget.VIRTUAL_CONTAINER,
        {
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: "336",
            height: "126",
          },
          children: [
            [
              widget.IMG,
              {
                src: "image/keyboard_setting.png",
                auto_scale: true,
                layout: {
                  ...default_layout,
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  tags: "ignore-layout",
                },
              },
            ],
            [
              widget.TEXT,
              {
                ...default_text_style,
                text: appName,
                align_h: align.LEFT,
                layout: {
                  ...default_layout,
                  left: "20",
                  top: "5",
                  max_width: "220",
                  height: "auto",
                  font_size: "30",
                  line_clamp: 2,
                },
              },
            ],
          ],
        },
      ],
      [
        widget.TEXT,
        {
          text: `Please toggle ${appName} on in settings`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
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
            ...default_layout,
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
            ...default_layout,
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
            ...default_layout,
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column",
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
          text: `Enable ${appName}`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
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
          auto_scale: true,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: "336",
            height: "126",
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: `Touch and hold the Globe key on the keyboard, then select ${appName}`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: "100%",
            height: "auto",
            font_size: "36",
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
          click_func: () => {
            this.keyboard(() => {
              this.onResume();
            });
          },
          layout_parent: vc,
          layout: {
            ...default_layout,
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
            ...default_layout,
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
            ...default_layout,
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column",
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
          text: appName,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            ...default_layout,
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
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
          click_func: () => {
            this.keyboard();
          },
          layout_parent: vc,
          layout: {
            ...default_layout,
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
              ...default_layout,
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
          normal_color: 0x0c86d1,
          press_color: 0x0c86d1,
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
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            ...default_layout,
            width: "100%",
            height: "100",
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
