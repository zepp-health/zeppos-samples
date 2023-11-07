import * as hmUI from "@zos/ui";
import { px } from "@zos/utils";

import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants";
import { DEVICE_WIDTH } from "../utils/config/device";

export const FETCH_BUTTON = {
  x: (DEVICE_WIDTH - px(360)) / 2,
  y: px(300),
  w: px(360),
  h: px(80),
  text_size: px(36),
  radius: px(12),
  normal_color: DEFAULT_COLOR,
  press_color: DEFAULT_COLOR_TRANSPARENT,
  text: "Fetch Data",
};

export const FETCH_RESULT_TEXT = {
  x: px(56),
  y: px(74),
  w: DEVICE_WIDTH - 2 * px(56),
  h: px(200),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
};
