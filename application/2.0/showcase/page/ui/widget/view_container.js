import { createWidget, widget, align, text_style } from '@zos/ui'
import { px } from '@zos/utils'
import { getRandomColor } from '../../../utils/utils'
import { DEFAULT_COLOR, DEFAULT_COLOR_TRANSPARENT } from '../../../config/constants'

Page({
  build() {
    createWidget(widget.TEXT, {
      x: px(96),
      y: px(40),
      w: px(288),
      h: px(46),
      color: 0xffffff,
      text_size: px(36),
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: 'VIEW_CONTAINER'
    })

    const viewContainer = createWidget(widget.VIEW_CONTAINER, {
      x: px(0),
      y: px(86),
      w: px(480),
      h: px(400),
      scroll_frame_func(info) {
        console.log('scroll frame')
        console.log(JSON.stringify(info))
      },
      scroll_complete_func(info) {
        console.log('scroll complete')
        console.log(JSON.stringify(info))
      }
    })

    Array.from({ length: 5 }).forEach((_, index) => {
      viewContainer.createWidget(widget.FILL_RECT, {
        x: 0,
        y: px(index * 400),
        w: px(480),
        h: px(400),
        color: getRandomColor()
      })

      viewContainer.createWidget(widget.TEXT, {
        x: px(96),
        y: px(170) + px(index * 400),
        w: px(288),
        h: px(46),
        text_size: px(36),
        color: 0xffffff,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text: `INDEX: ${index}`
      })
    })

    const viewContainerButton = createWidget(widget.VIEW_CONTAINER, {
      x: px(0),
      y: px(86),
      w: px(480),
      h: px(400),
      z_index: 1,
      scroll_enable: false
    })

    viewContainerButton.createWidget(widget.BUTTON, {
      x: 0,
      y: px(50),
      w: px(200),
      h: px(100),
      text: 'Click',
      radius: px(12),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      click_func: () => {
        console.log('123')
      }
    })
  }
})
