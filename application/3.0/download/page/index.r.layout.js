import hmUI from "@zos/ui";
import { getText } from "@zos/i18n";
import { px } from "@zos/utils";
import { DEVICE_WIDTH } from "./../utils/constants";

export const TIPS_STYLE = {
  x: px(56),
  y: px(100),
  w: DEVICE_WIDTH - 2 * px(56),
  h: px(220),
  color: 0xffffff,
  text: "",
  text_size: px(40),
  align_h: hmUI.align.CENTER_H,
  align_v: hmUI.align.CENTER_V,
  text_style: hmUI.text_style.WRAP,
  font: "/system/fonts/allfont-Medium.ttf",
  alpha: 0x99,
  enable: false,
};

export const COVER_IMG = {
  x: px(125),
  y: px(60),
  w: px(230),
  h: px(230),
  // auto_scale: true,
};

export const DOWNLOAD_BTN = {
  x: px(90),
  y: px(350),
  w: px(96),
  h: px(96),
  normal_src: "download.png",
  press_src: "download.png",
};

export const TRANS_BTN = {
  x: px(294),
  y: px(350),
  w: px(96),
  h: px(96),
  normal_src: "transfer.png",
  press_src: "transfer.png",
};
