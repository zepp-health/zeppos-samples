import { gettext } from "i18n"

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = hmSetting.getDeviceInfo()

export const TEXT_STYLE = {
  text: gettext('appName'),
  x: px(42),
  y: px(200),
  w: DEVICE_WIDTH - px(42) * 2,
  h: px(100),
  color: 0xffffff,
  text_size: px(36),
  align_h: hmUI.align.CENTER_H,
  text_style: hmUI.text_style.WRAP,
}