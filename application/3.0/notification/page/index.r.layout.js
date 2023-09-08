import hmUI from "@zos/ui";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "./../utils/constants";

export const BTN_STYLE = {
  x: px(56),
  y: px(240),
  w: DEVICE_WIDTH - 2 * px(56),
  h: px(100),
  radius: px(16),
  text_size: px(36),
  normal_color: 0xfc6950,
  press_color: 0xfeb4a8,
  text: "SEND",
};
