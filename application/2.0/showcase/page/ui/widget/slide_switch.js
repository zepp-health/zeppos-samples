import { createWidget, widget, prop } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'SLIDE_SWITCH'
  },
  build() {
    const slide_switch = createWidget(widget.SLIDE_SWITCH, {
      x: px(200),
      y: px(200),
      w: px(96),
      h: px(64),
      select_bg: 'switch_on.png',
      un_select_bg: 'switch_off.png',
      slide_src: 'radio_select.png',
      slide_select_x: px(40),
      slide_un_select_x: px(8),
      checked: true,
      checked_change_func: (slideSwitch, checked) => {
        this.state.logger.log('checked', checked)
      }
    })

    this.state.logger.log('slide checked', slide_switch.getProperty(prop.CHECKED))
  }
})
