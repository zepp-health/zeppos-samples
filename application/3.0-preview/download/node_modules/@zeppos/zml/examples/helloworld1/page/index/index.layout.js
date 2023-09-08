import { BTN_STYLE } from './index.style'
import ui from '@zos/ui'
import { getText } from '@zos/i18n'

export const layout = {
  refs: {},
  render(vm) {
    this.refs.btn1 = ui.createWidget(ui.widget.TEXT, {
      ...BTN_STYLE,
      text: getText('appName'),
    })

    this.refs.btn2 = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      y: BTN_STYLE.y + 100,
      color: 0xff00ff,
      text: 'test httpRequest',
      click_func: () => {
        vm.getDataFromNetwork()
      },
    })
  },
}
