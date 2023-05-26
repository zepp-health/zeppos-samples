import { createWidget, widget, prop } from '@zos/ui'
import { Distance } from '@zos/sensor'
import { px } from '@zos/utils'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'DISTANCE'
  },
  build() {
    const distance = new Distance()

    const currentText = new TextByLine({
      text: `current:${distance.getCurrent()}`,
      line: 0
    }).render()

    const changeEventText = new TextByLine({
      text: `EVENT-CHANGE:${distance.getCurrent()}`,
      line: 1
    }).render()

    const changeCallback = () => {
      changeEventText.setProperty(prop.MORE, {
        text: `EVENT-CHANGE: ${distance.getCurrent()}`
      })
    }

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(300),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: 'REGISTER_CHANGE',
      click_func: () => {
        distance.onChange(changeCallback)
      }
    })
  }
})
