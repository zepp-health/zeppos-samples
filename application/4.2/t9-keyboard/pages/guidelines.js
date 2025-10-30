/** 
 * @about This is a guidelines page that can be used as is in your keyboard project. 
 *        Ensure that you carry over the resources from the assets/{*}/guidelines folder(s). 
 */
import {
  keyboard, createWidget, widget, createKeyboard, deleteKeyboard,
  align, text_style, deleteWidget, updateLayout, getTextLayout
} from "@zos/ui";

import { showToast } from "@zos/interaction";
import { scrollTo } from "@zos/page";
import { exit } from "@zos/router";
import { getPackageInfo } from '@zos/app';
import { px } from '@zos/utils';
import { setStatusBarVisible } from '@zos/ui';
import { getDeviceInfo, SCREEN_SHAPE_SQUARE } from '@zos/device';

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

Page({
  state: {
    is_enabled: keyboard.isEnabled(),
    is_selected: keyboard.isSelected(),
    vc: null,
    title_text: `Enable ${KEYBOARD_NAME}`,
  },

  // #region life cycles
  onInit() { },

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
      const items = ele.layoutChildren;
      deleteWidget(ele);
      items.forEach((item) => deleteWidget(item));
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
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: "5.2vw",
            padding_top: "8.3vw",
            padding_left: "15vw",
            padding_right: "15vw",
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
            font_size: "8.3vw",
          },
        },
      ],
      [
        widget.IMG,
        {
          src: "guidelines/keyboard_setting.png",
          layout_parent: vc,
          auto_scale: true,
          layout: {
            width: "100%",
            height: "26.25vw", // 126px/480 = 0.2625 = 26.25vw
          },
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
            font_size: "7.5vw",
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
            height: "18.3vw",
            font_size: "7.5vw",
            corner_radius: "9.2vw",
          },
        },
      ],
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "20.8vw",
          },
        },
      ],
    ].forEach(([id, opts]) => {
      createElement(id, opts);
    });

    const { width } = DeviceInfo;
    const pad_h = Math.round(width * 0.15);     // 15vw (72/480px)
    const pad_top = Math.round(width * 0.083);  // 8.3vw (40/480px)
    const row_gap = Math.round(width * 0.052);  // 5.2vw (25/480px)
    const overlay_text_offset = Math.round(width * 0.048);
    const title_font_size = Math.round(width * 0.083); // 40px font @480 = 8.3vw (40/480px)
    const available_width = width - (pad_h * 2);

    const title_layout = getTextLayout(this.state.title_text, {
      text_size: title_font_size,
      text_width: 0,
      wrapped: 0,
    });

    const num_lines = Math.ceil(title_layout.width / available_width);
    const title_height = num_lines * title_layout.height;
    const img_top_y = pad_top + title_height + row_gap;
    const overlay_y = img_top_y + overlay_text_offset;

    const overlay_text = createWidget(widget.TEXT, {
      x: px(Math.round(width * 0.2)),
      y: px(Math.round(overlay_y)),
      w: px(Math.round(width * 0.42)),
      h: px(Math.round(width * 0.083)),
      text: KEYBOARD_NAME,
      color: COLORS.WHITE,
      text_size: Math.round(width * 0.0625),
      text_style: text_style.ELLIPSIS,
    });
    overlay_text.setLayoutParent(vc.current);
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
            left: "0",
            top: "0",
            width: "100vw",
            height: "200vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: "5.2vw",
            padding_top: "8.3vw",
            padding_left: "15vw",
            padding_right: "15vw",
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
            font_size: "8.3vw",
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
            height: "26.25vw",
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
            min_height: "20.8vw",
            height: "auto",
            font_size: "7.5vw",
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: COLORS.BLUE,
          press_color: COLORS.BLUE,
          click_func: () => {
            this.keyboard(() => {
              this.onResume();
            });
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "18.3vw",
            font_size: "7.5vw",
            corner_radius: "9.2vw",
          },
        },
      ],
      [
        widget.FILL_RECT,
        {
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "20.8vw",
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
            left: "0",
            top: "0",
            width: "100vw",
            height: "300vh",
            display: "flex",
            flex_flow: "column wrap",
            row_gap: "2.1vw",
            padding_top: "8.3vw",
            padding_left: "15vw",
            padding_right: "15vw",
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
            font_size: "8.3vw",
          },
        },
      ],
      [
        widget.BUTTON,
        {
          text: "Show Keyboard",
          normal_color: COLORS.BLUE,
          press_color: COLORS.BLUE,
          click_func: () => {
            this.keyboard();
          },
          layout_parent: vc,
          layout: {
            width: "100%",
            height: "18.3vw",
            font_size: "7.5vw",
            corner_radius: "9.2vw",
          },
        },
      ],
      // TODO: manually populate other fields when necessary
      ...["Languages", "Layout", "Themes", "Sound & vibration", "Privacy", "About"].map((i) => {
        return [
          widget.BUTTON,
          {
            text: i,
            normal_color: COLORS.GRAY,
            press_color: COLORS.GRAY,
            click_func() {
              showToast({ content: i });
            },
            layout_parent: vc,
            layout: {
              width: "100%",
              height: "18.3vw",
              font_size: "7.5vw",
              corner_radius: "9.2vw",
            },
          },
        ];
      }),
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
            height: "18.3vw",
            font_size: "7.5vw",
            corner_radius: "9.2vw",
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