import { createWidget, widget, prop, event, align, text_style } from '@zos/ui'
import { px } from '@zos/utils'
import { Stress } from '@zos/sensor'
import PageAdvanced from '../../utils/template/PageAdvanced'
import { DEFAULT_COLOR, DEFAULT_COLOR_TRANSPARENT } from '../../config/constants'

PageAdvanced({
  state: {
    pageName: 'STRESS'
  },
  build() {
    const stress = new Stress()

    const { value, time } = stress.getCurrent()

    const text = createWidget(widget.TEXT, {
      x: px(0),
      y: px(120),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `VALUE: ${value}; TIME: ${time}`
    })

    this.state.logger.log(`VALUE: ${value}; TIME: ${time}`)

    text.addEventListener(event.CLICK_DOWN, (info) => {
      const { value, time } = stress.getCurrent()

      text.setProperty(prop.MORE, {
        text: `VALUE: ${value}; TIME: ${time}`
      })
    })

    const currentText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(180),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `CHANGE: `
    })

    const changeCallback = () => {
      const { value, time } = stress.getCurrent()

      currentText.setProperty(prop.MORE, {
        text: `CHANGE: VALUE ${value}|TIME ${time}`
      })
    }

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(300),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: 'REGISTER_CHANGE',
      click_func: () => {
        stress.onChange(changeCallback)
      }
    })
  }
})
