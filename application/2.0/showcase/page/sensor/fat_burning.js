import { createWidget, widget, prop } from '@zos/ui'
import { FatBurning } from '@zos/sensor'
import { px } from '@zos/utils'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'FAT_BURRING'
  },
  build() {
    const fatBurning = new FatBurning()

    const currentText = new TextByLine({
      text: `current:${fatBurning.getCurrent()};target:${fatBurning.getTarget()}`,
      line: 0
    }).render()

    const changeEventText = new TextByLine({
      text: `EVENT-CHANGE:${fatBurning.getCurrent()}`,
      line: 1
    }).render()

    const changeCallback = () => {
      changeEventText.setProperty(prop.MORE, {
        text: `EVENT-CHANGE: ${fatBurning.getCurrent()}`
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
        fatBurning.onChange(changeCallback)
      }
    })
  }
})
