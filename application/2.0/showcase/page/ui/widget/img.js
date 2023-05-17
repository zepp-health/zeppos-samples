import { createWidget, widget, event, prop } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'IMG'
  },
  build() {
    const img = createWidget(widget.IMG, {
      x: px(125),
      y: px(125),
      src: 'zeppos.png'
    })

    img.addEventListener(event.CLICK_DOWN, (info) => {
      this.state.logger.log('click down info', info)
      img.setProperty(prop.MORE, {
        y: px(200)
      })
    })
  }
})
