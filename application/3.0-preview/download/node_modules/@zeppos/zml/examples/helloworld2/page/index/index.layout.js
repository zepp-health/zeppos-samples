import { BTN_STYLE } from './index.style'
import ui from '@zos/ui'
import { getText } from '@zos/i18n'

export const layout = {
  refs: {},
  render(vm) {
    this.refs.txt1 = ui.createWidget(ui.widget.TEXT, {
      ...BTN_STYLE,
      text: getText('appName'),
    })

    this.refs.btn1 = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      y: BTN_STYLE.y + 100,
      color: 0xff00ff,
      text: 'test request',
      click_func: () => {
        vm.getDataFromMobile()
      },
    })

    this.refs.btn2 = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      y: BTN_STYLE.y + 200,
      color: 0xff00ff,
      text: 'test call',
      click_func: () => {
        vm.notifyMobile()
      },
    })

    this.refs.btn3 = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      y: BTN_STYLE.y + 300,
      color: 0xff00ff,
      text: 'test request from mobile',
      click_func: () => {
        vm.sendCmd('mobile.request', {
          param1: 'device1',
          param2: 'device2'
        })
      },
    })

    this.refs.btn4 = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      y: BTN_STYLE.y + 400,
      color: 0xff00ff,
      text: 'test call from mobile',
      click_func: () => {
        vm.sendCmd('mobile.call', {
          param1: 'device3',
          param2: 'device4'
        })
      },
    })
  },
}
