import { createWidget, widget, event, prop } from '@zos/ui'
import { px } from '@zos/utils'
import { DEFAULT_COLOR } from '../../../config/constants'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'STROKE_RECT'
  },
  build() {
    const strokeRect = createWidget(widget.STROKE_RECT, {
      x: px(125),
      y: px(125),
      w: px(230),
      h: px(150),
      radius: px(20),
      line_width: px(4),
      color: DEFAULT_COLOR
    })

    strokeRect.addEventListener(event.CLICK_DOWN, (info) => {
      this.state.logger.log('click down info', info)
      strokeRect.setProperty(prop.MORE, {
        y: px(200)
      })
    })
  }
})
