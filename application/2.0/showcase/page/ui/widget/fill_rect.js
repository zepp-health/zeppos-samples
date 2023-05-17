import { createWidget, widget, event, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { DEFAULT_COLOR } from '../../../config/constants'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'FILL_RECT'
  },
  build() {
    const fill_rect = createWidget(widget.FILL_RECT, {
      x: px(125),
      y: px(125),
      w: px(230),
      h: px(150),
      radius: px(20),
      color: DEFAULT_COLOR
    })

    fill_rect.addEventListener(event.CLICK_DOWN, (info) => {
      fill_rect.setProperty(prop.MORE, {
        x: px(125),
        y: px(200),
        w: px(230),
        h: px(150)
      })
    })
  }
})
