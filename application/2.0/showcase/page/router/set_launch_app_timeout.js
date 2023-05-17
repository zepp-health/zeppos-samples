import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import { Time } from '@zos/sensor'
import PageAdvanced from '../../utils/template/PageAdvanced'
import { setLaunchAppTimeout } from '@zos/router'

PageAdvanced({
  state: {
    pageName: 'SetLaunchAppTimeOut'
  },
  build() {
    const time = new Time()

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(300),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: 'setLaunchAppTimeOut',
      click_func: () => {
        setLaunchAppTimeout({
          url: 'page/index',
          appId: 25107,
          utc: time.getTime() + 1000
        })
      }
    })
  }
})
