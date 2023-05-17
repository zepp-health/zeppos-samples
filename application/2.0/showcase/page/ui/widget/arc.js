import { createWidget, widget, event, prop } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'
import { DEFAULT_COLOR } from '../../../config/constants'

PageAdvanced({
  state: {
    pageName: 'ARC'
  },
  build() {
    const arc = createWidget(widget.ARC, {
      x: px(100),
      y: px(100),
      w: px(250),
      h: px(250),
      start_angle: -90,
      end_angle: 90,
      color: DEFAULT_COLOR,
      line_width: 20
    })

    arc.addEventListener(event.CLICK_DOWN, (info) => {
      arc.setProperty(prop.MORE, {
        y: px(150)
      })
    })
  }
})
