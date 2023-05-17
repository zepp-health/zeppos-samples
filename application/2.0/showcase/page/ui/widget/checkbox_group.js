import { createWidget, widget, prop } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'CHECKBOX_GROUP'
  },
  build() {
    const checkbox_group = createWidget(widget.CHECKBOX_GROUP, {
      x: px(0),
      y: px(0),
      w: px(480),
      h: px(64),
      select_src: 'selected.png',
      unselect_src: 'unselected.png',
      check_func: (group, index, checked) => {
        this.state.logger.log('index', index)
        this.state.logger.log('checked', checked)
      }
    })

    const button1 = checkbox_group.createWidget(widget.STATE_BUTTON, {
      x: px(40),
      y: px(200),
      w: px(64),
      h: px(64)
    })
    const button2 = checkbox_group.createWidget(widget.STATE_BUTTON, {
      x: px(190),
      y: px(200),
      w: px(64),
      h: px(64)
    })
    const button3 = checkbox_group.createWidget(widget.STATE_BUTTON, {
      x: px(340),
      y: px(200),
      w: px(64),
      h: px(64)
    })

    checkbox_group.setProperty(prop.INIT, button2)
    checkbox_group.setProperty(prop.CHECKED, button3)
  }
})
