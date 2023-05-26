import { createWidget, widget, prop } from '@zos/ui'
import { Step } from '@zos/sensor'
import { px } from '@zos/utils'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'STEP'
  },
  build() {
    const step = new Step()

    const currentText = new TextByLine({
      text: `current:${step.getCurrent()};target:${step.getTarget()}`,
      line: 0
    }).render()

    const changeEventText = new TextByLine({
      text: `EVENT-CHANGE:${step.getCurrent()}`,
      line: 1
    }).render()

    const changeCallback = () => {
      changeEventText.setProperty(prop.MORE, {
        text: `EVENT-CHANGE: ${step.getCurrent()}`
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
        step.onChange(changeCallback)
      }
    })
  }
})
