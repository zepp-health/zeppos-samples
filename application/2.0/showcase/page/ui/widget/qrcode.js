import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'QRCODE'
  },
  build() {
    createWidget(widget.QRCODE, {
      x: px(140),
      y: px(140),
      w: px(200),
      h: px(200),
      bg_x: px(120),
      bg_y: px(120),
      bg_w: px(240),
      bg_h: px(240),
      content: 'Hello Zepp OS'
    })
  }
})
