import { createWidget, widget, align, text_style } from '@zos/ui'
import { px } from '@zos/utils'

export default class TextByLine {
  constructor(params) {
    const { text = '', y = undefined, line = 0 } = params

    this.text = text
    this.y = y
    this.line = line
    this.y_computed = Number.isInteger(this.y) ? this.y : px(this.line * 60 + 120)
  }

  render() {
    return createWidget(widget.TEXT, {
      x: px(40),
      y: this.y_computed,
      w: px(400),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: this.text
    })
  }
}
