import * as hmUI from '@zos/ui'

export function createMask(style, parent = hmUI, isMaskActive = false) {
  const mask = parent.createWidget(hmUI.widget.FILL_RECT, {
    ...style,
    color: 0x000000,
    alpha: 0x96,
    enable: isMaskActive
  })
  mask.setAlpha(0x96)
  mask.setProperty(hmUI.prop.VISIBLE, isMaskActive)
  return mask
}
