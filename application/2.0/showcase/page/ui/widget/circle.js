import PageAdvanced from '../../../utils/template/PageAdvanced'
import { DEFAULT_COLOR } from '../../../config/constants'

PageAdvanced({
  state: {
    pageName: 'CIRCLE'
  },
  build() {
    const circle = hmUI.createWidget(hmUI.widget.CIRCLE, {
      center_x: px(240),
      center_y: px(240),
      radius: px(120),
      color: DEFAULT_COLOR,
      alpha: 200
    })

    // 暂时不支持，代码先保留
    circle.addEventListener(hmUI.event.CLICK_DOWN, () => {
      this.state.logger.log('circle click')
      circle.setProperty(hmUI.prop.MORE, {
        center_x: px(240),
        center_y: px(300),
        radius: px(120),
        color: DEFAULT_COLOR
      })
    })
  }
})
