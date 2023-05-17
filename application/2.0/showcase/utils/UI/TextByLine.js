import { createWidget, widget, align, text_style } from '@zos/ui'
import { px } from '@zos/utils'

export default class TextByLine {
  constructor(params = {}) {
    const { text = '', line = 0 } = params

    this.text = text
    this.line = line
  }

  render(params = {}) {
    let { text = this.text, line = 0 } = params

    if (!line) {
      line = this.line
    }

    const y = px(line * 60 + 120)

    this.line = line + 1

    return createWidget(widget.TEXT, {
      x: px(0),
      y,
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text
    })
  }
}
