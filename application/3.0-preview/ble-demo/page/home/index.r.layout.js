import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { px } from "@zos/utils";

// 设备宽高
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

export const BTN_STYLE = {
  x: px(60),
  y: px(60),
  text: "start",
  w: DEVICE_WIDTH - 2 * px(60),
  h: px(100),
  radius: px(50),
  text_size: px(36),
  normal_color: 0x666666,
  press_color: 0x333333,
};
export const TEXT_STYLE = {
  x: px(40),
  y: px(170),
  w: DEVICE_WIDTH - px(40) * 2,
  h: px(280),
  color: 0xffffff,
  text_size: px(32),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
  text: "",
};
