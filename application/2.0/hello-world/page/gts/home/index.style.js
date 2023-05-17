import { align, text_style } from '@zos/ui'
import { getText } from '@zos/i18n'
import { getDeviceInfo } from '@zos/device'

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo()

export const TEXT_STYLE = {
  text: getText('appName'),
  x: 42,
  y: 200,
  w: DEVICE_WIDTH - 42 * 2,
  h: 100,
  color: 0xffffff,
  text_size: 36,
  align_h: align.CENTER_H,
  text_style: text_style.WRAP,
}
