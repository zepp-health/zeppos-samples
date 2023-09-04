import * as hmUI from '@zos/ui'
import { createMask } from '../mask'

export function createPressedBtn(style, clickCb = () => {}, parent = hmUI, isMaskActive = false) {
  let mask
  const btn = parent.createWidget(hmUI.widget.BUTTON, {
    ...style,
    click_down: () => {
      mask.setProperty(hmUI.prop.VISIBLE, true)
    },
    click_func: () => {
      mask.setProperty(hmUI.prop.VISIBLE, false)
      clickCb && typeof clickCb === 'function' && clickCb()
    },
    click_up: () => {
      mask.setProperty(hmUI.prop.VISIBLE, false)
    },
    move_out: () => {
      mask.setProperty(hmUI.prop.VISIBLE, false)
    }
  })
  mask = createMask({ ...style }, parent, isMaskActive)
  return btn
}
