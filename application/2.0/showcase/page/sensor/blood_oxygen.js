import { createWidget, widget, prop } from '@zos/ui'
import { BloodOxygen } from '@zos/sensor'
import { px } from '@zos/utils'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'BloodOxygen'
  },
  build() {
    const bloodOxygen = new BloodOxygen()
    const currentObj = bloodOxygen.getCurrent()

    new TextByLine({
      text: `value:${currentObj.value};time:${currentObj.time};retCode:${currentObj.retCode}`,
      line: 0
    }).render()

    const changeEventText = new TextByLine({
      text: `EVENT-CHANGE:${bloodOxygen.getCurrent().value}`,
      line: 1
    }).render()

    const changeCallback = () => {
      const { value, time, retCode } = bloodOxygen.getCurrent()

      changeEventText.setProperty(prop.MORE, {
        text: `EVENT-CHANGE: ${value};${time};${retCode}`
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
        bloodOxygen.onChange(changeCallback)
      }
    })

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(380),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: 'START',
      click_func: () => {
        bloodOxygen.stop()
        bloodOxygen.start()
      }
    })
  }
})
