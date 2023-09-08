import { TEXT_STYLE, BTN_STYLE } from './index.style'
import ui from '@zos/ui'

export const layout = {
  refs: {},
  render(vm) {
    this.refs.txt = ui.createWidget(ui.widget.TEXT, {
      ...TEXT_STYLE,
    })

    this.refs.btn = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      click_func: () => {
        this.refs.btn.setProperty(ui.prop.MORE, {
          color: 0xffffff,
        })

        vm.readAsync()
      },
    })
  },

  updateTxtSuccess(text) {
    this.refs.txt.setProperty(ui.prop.MORE, {
      color: 0x00ff00,
      text,
    })
  },
  updateTxtError(message) {
    this.refs.txt.setProperty(ui.prop.MORE, {
      color: 0xff0000,
      text,
    })
  },
}
