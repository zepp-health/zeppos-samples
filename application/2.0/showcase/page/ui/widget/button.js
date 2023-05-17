import { createWidget, widget, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { DEVICE_WIDTH } from '../../../config/device'
import PageAdvanced from '../../../utils/template/PageAdvanced'
import { DEFAULT_COLOR, DEFAULT_COLOR_TRANSPARENT } from '../../../config/constants'

PageAdvanced({
  state: {
    pageName: 'Button'
  },
  build() {
    const img_button = createWidget(widget.BUTTON, {
      x: (DEVICE_WIDTH - px(96)) / 2,
      y: 120,
      text: 'Hello',
      w: -1,
      h: -1,
      normal_src: 'button_normal.png',
      press_src: 'button_press.png',
      click_func: () => {
        this.state.logger.log('button click')
      }
    })

    createWidget(widget.BUTTON, {
      x: (DEVICE_WIDTH - px(400)) / 2,
      y: px(240),
      w: px(400),
      h: px(100),
      radius: px(12),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: 'Hello',
      click_func: (button_widget) => {
        button_widget.setProperty(prop.MORE, {
          x: (DEVICE_WIDTH - px(400)) / 2,
          y: px(300),
          w: px(400),
          h: px(100)
        })
      }
    })
  }
})
