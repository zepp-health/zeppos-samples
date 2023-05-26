import { createWidget, widget, prop, event, align, text_style } from '@zos/ui'
import { HeartRate } from '@zos/sensor'
import { px } from '@zos/utils'
import PageAdvanced from '../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'HeartRate'
  },
  build() {
    const heartRate = new HeartRate()

    const text = createWidget(widget.TEXT, {
      x: px(0),
      y: px(120),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `CURRENT: ${heartRate.getCurrent()}; LAST: ${heartRate.getLast()}`
    })

    text.addEventListener(event.CLICK_DOWN, (info) => {
      text.setProperty(prop.MORE, {
        text: `CURRENT: ${heartRate.getCurrent()}; LAST: ${heartRate.getLast()}`
      })
    })

    const currentText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(180),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `EVENT-CURRENT: `
    })

    const lastText = createWidget(widget.TEXT, {
      x: px(0),
      y: px(240),
      w: px(480),
      h: px(46),
      color: 0xffffff,
      text_size: px(20),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `EVENT-LAST: `
    })

    const currCallback = () => {
      currentText.setProperty(prop.MORE, {
        text: `EVENT-CURRENT: ${heartRate.getCurrent()}`
      })
    }

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(300),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: 'REGISTER_CURRENT',
      click_func: () => {
        heartRate.onCurrentChange(currCallback)
      }
    })

    const lastCallback = () => {
      lastText.setProperty(prop.MORE, {
        text: `EVENT-LAST: ${heartRate.getLast()}`
      })
    }

    createWidget(widget.BUTTON, {
      x: px(80),
      y: px(380),
      w: px(300),
      h: px(60),
      radius: px(12),
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: 'REGISTER_LAST',
      click_func: () => {
        heartRate.onLastChange(lastCallback)
      }
    })
  }
})
