import { createWidget, widget, align } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'HISTOGRAM'
  },

  build() {
    const fillRect = createWidget(widget.FILL_RECT, {
      x: px(100),
      y: px(120),
      w: px(300),
      h: px(300),
      color: 0xffffff
    })

    const view = createWidget(widget.HISTOGRAM, {
      x: px(100),
      y: px(120),
      h: 300,
      w: 300,
      item_width: 20,
      item_space: 10,
      item_radius: 10,
      item_start_y: 50,
      item_max_height: 230,
      item_color: 0x304ffe,
      data_array: [20, 30, 40, 50, 60, 100, 80, 90, 20, 30],
      data_count: 10,
      data_min_value: 10,
      data_max_value: 100,
      xline: {
        pading: 20,
        space: 20,
        start: 0,
        end: 300,
        color: 0x00c853,
        width: 1,
        count: 15
      },
      yline: {
        pading: 10,
        space: 10,
        start: 0,
        end: 300,
        color: 0xff6d00,
        width: 1,
        count: 30
      },
      xText: {
        x: px(12),
        y: px(270),
        w: px(20),
        h: px(50),
        space: 10,
        align: align.LEFT,
        color: 0x000000,
        count: 10,
        data_array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      },
      yText: {
        x: 0,
        y: px(20),
        w: px(50),
        h: px(50),
        space: px(10),
        align: align.LEFT,
        color: 0x000000,
        count: 6,
        data_array: ['a', 'b', 'c', 'd', 'e', 'f']
      }
    })
  }
})
