/** 
 * @about This is a guidelines page that can be used as is in your keyboard project. 
 *        Ensure that you carry over the resources from the assets/{*}/guidelines folder(s). 
 */
import {
  createWidget, widget, createKeyboard, deleteKeyboard,
  align, text_style, deleteWidget, updateLayout,
} from "@zos/ui";

import { showToast } from "@zos/interaction";
import { scrollTo } from "@zos/page";
import { exit } from "@zos/router";
import { getPackageInfo } from '@zos/app';
import { setStatusBarVisible } from '@zos/ui';
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from '@zos/device';

import { keyboard } from "../data-widget/modules/safe-keyboard";

const DeviceInfo = getDeviceInfo();
const KEYBOARD_NAME = getPackageInfo().name;

const COLORS = {
  WHITE: 0xffffff,
  GRAY: 0x383838,
  BLUE: 0x0c86d1,
}
const default_text_style = {
  color: COLORS.WHITE,
  align_v: align.CENTER_V,
  align_h: align.CENTER_H,
  text_style: text_style.CHAR_WRAP,
}

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

// viewport (px) -> vw/vh converter
function vp(px, unit = 'vw', reference_width = 480) {
  return ((px / reference_width) * 100) + unit;
}

Page({
  state: {
    is_enabled: keyboard.isEnabled(),
    is_selected: keyboard.isSelected(),
    vc: null,
    title_text: `Enable ${KEYBOARD_NAME}`,
  },

  // #region life cycles
  onInit() { this.hideStatusBar(); },

  build() {
    if (!this.state.is_enabled) {
      this.build_EnablePage();
    } else if (!this.state.is_selected) {
      this.build_SelectPage();
    } else {
      this.build_SettingPage();
    }
  },

  onPause() { },

  onResume() {
    this.state.is_enabled = keyboard.isEnabled();
    this.state.is_selected = keyboard.isSelected();

    this.clearPage();
    this.build();
    this.refreshLayout();
    this.scrollToTop();
  },
  // #endregion

  // #region helpers
  scrollToTop() { scrollTo({ y: 0 }); },

  refreshLayout() {
    if (this.state.vc && this.state.vc.current) {
      updateLayout(this.state.vc.current);
    }
  },

  clearPage() {
    if (this.state.vc && this.state.vc.current) {
      const ele = this.state.vc.current;
      removeElement(ele);
      this.state.vc.current = null;
    }
  },

  hideStatusBar() {
    if (DeviceInfo.screenShape === SCREEN_SHAPE_SQUARE) {
      setStatusBarVisible(false);
    }
  },
  // #endregion

  // #region Enable Page
  build_EnablePage() {
    const vc = ref(null);
    this.state.vc = vc;

    [
      [
        widget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: vp(25),
            padding_top: vp(40),
            padding_left: vp(72),
            padding_right: vp(72),
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: this.state.title_text,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: vp(40),
          },
        },
      ],
      [
        widget.VIRTUAL_CONTAINER,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(126), // 126px/480 = 0.2625 = 26.25vw
          },
          children: [
            [
              widget.IMG,
              {
                src: "guidelines/keyboard_setting.png",
                auto_scale: true,
                layout: {
                  width: "100%",
                  height: "100%",
                },
              },
            ],
            [
              widget.TEXT,
              {
                ...default_text_style,
                text: KEYBOARD_NAME,
                align_h: align.LEFT,
                layout: {
                  width: "auto",
                  left: vp(20),
                  max_width: vp(200),
                  height: vp(70),
                  font_size: vp(30), // 480 * 0.0625 = 30px (24px @390)
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
          text: `Please toggle on ${KEYBOARD_NAME} in settings`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: vp(36),
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Go to Settings",
          normal_color: COLORS.GRAY,
          press_color: COLORS.GRAY,
          click_func() {
            keyboard.gotoSettings();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(88),
            font_size: vp(36),
            corner_radius: vp(44),
          },
        },
      ],
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(100),
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },
  // #endregion

  // #region Select Page
  build_SelectPage() {
    const vc = ref(null);
    this.state.vc = vc;
    [
      [
        widget.VIRTUAL_CONTAINER,
        {
          ref: vc,
          layout: {
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: vp(25),
            padding_top: vp(40),
            padding_left: vp(72),
            padding_right: vp(72),
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: this.state.title_text,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: vp(40),
          },
        },
      ],
      [
        widget.IMG,
        {
          src: "guidelines/keyboard_enable.png",
          auto_scale: true,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(126),
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: `Touch and hold the Globe key on the keyboard, then select ${KEYBOARD_NAME}`,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: vp(36),
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: COLORS.GRAY,
          press_color: COLORS.GRAY,
          click_func: () => {
            this.keyboard(() => {
              this.onResume();
            });
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(88),
            font_size: vp(36),
            corner_radius: vp(44),
          },
        },
      ],
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(100),
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },
  // #endregion

  // #region Settings Page
  build_SettingPage() {
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
            width: "100vw",
            height: "300vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: vp(10),
            padding_top: vp(40),
            padding_left: vp(72),
            padding_right: vp(72),
          },
        },
      ],
      [
        widget.TEXT,
        {
          text: KEYBOARD_NAME,
          ...default_text_style,
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "auto",
            font_size: vp(40),
          },
        },
      ],
      // spacer
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(60),
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: COLORS.GRAY,
          press_color: COLORS.GRAY,
          click_func: () => {
            this.keyboard();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(88),
            font_size: vp(36),
            corner_radius: vp(44),
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Exit",
          normal_color: COLORS.GRAY,
          press_color: COLORS.GRAY,
          click_func() {
            exit();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: vp(88),
            font_size: vp(36),
            corner_radius: vp(44),
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });
  },
  // #endregion

  keyboard(cb) {
    createKeyboard({
      onComplete: (kb, result) => {
        deleteKeyboard();
        showToast({ content: "Input: " + result.data });
        cb && cb();
      },
      onCancel: () => {
        deleteKeyboard();
        cb && cb();
      },
    });
  },
});