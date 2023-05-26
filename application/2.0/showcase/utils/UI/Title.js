import { createWidget, widget, text_style, align } from '@zos/ui'
import { px } from '@zos/utils'

export default class Title {
  constructor(params) {
    const { text = '', y = px(40) } = params

    this.text = text
    this.y = y
  }

  render() {
    return createWidget(widget.TEXT, {
      x: px(96),
      y: this.y,
      w: px(288),
      h: px(46),
      color: 0xffffff,
      text_size: px(36),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: this.text
    })
  }
}
