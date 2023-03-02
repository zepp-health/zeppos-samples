import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import { DEVICE_WIDTH } from '../../config/device'
import { DEFAULT_COLOR, DEFAULT_COLOR_TRANSPARENT } from '../../config/constants'

export default class ButtonList {
  constructor(params) {
    const { list, absolute_y = 0, click_func = () => {} } = params

    this.click_func = click_func
    this.absolute_y = absolute_y
    this.list = list
    this.length = this.list.length
    this.space = px(24)
    this.buttonHeight = px(80)
    this.width = px(400)
    this.radius = px(12)
    this.text_size = px(36)

    this.widgetList = []
  }

  render() {
    this.list.forEach((i, index) => {
      const { text } = i

      this.widgetList[index] = createWidget(widget.BUTTON, {
        x: (DEVICE_WIDTH - this.width) / 2,
        y: this.absolute_y + index * (this.space + this.buttonHeight),
        w: this.width,
        h: this.buttonHeight,
        text,
        normal_color: DEFAULT_COLOR,
        press_color: DEFAULT_COLOR_TRANSPARENT,
        color: 0xffffff,
        text_size: this.text_size,
        radius: this.radius,
        click_func: () => {
          this.click_func(i, index)
        }
      })
    })
  }
}
