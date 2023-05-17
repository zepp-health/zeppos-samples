import { createWidget, widget, event } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'GRADKIENT_POLYLINE'
  },
  build() {
    const lineDataList = [
      { x: 0, y: px(200) },
      { x: px(100), y: px(10) },
      { x: px(200), y: px(50) },
      { x: px(300), y: px(50) },
      { x: px(400), y: px(200) }
    ]
    const polyline = createWidget(widget.GRADKIENT_POLYLINE, {
      x: 0,
      y: px(200),
      w: px(480),
      h: px(200),
      line_color: 0x00ffff,
      line_width: 4,
      bg_color: 0xffffff
    })
    polyline.clear()
    polyline.addLine({
      data: lineDataList,
      count: lineDataList.length
    })

    this.state.titleWidget.addEventListener(event.CLICK_DOWN, () => {
      polyline.clear()
    })
  }
})
