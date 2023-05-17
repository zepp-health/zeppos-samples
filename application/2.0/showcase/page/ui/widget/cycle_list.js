import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'CYCLE_LIST'
  },

  build() {
    const imgArray = ['number-img/0.png', 'number-img/1.png', 'number-img/2.png', 'number-img/3.png', 'number-img/4.png']
    const cycleList = createWidget(widget.CYCLE_LIST, {
      x: px(230),
      y: px(120),
      h: px(300),
      w: px(30),
      data_array: imgArray,
      data_size: 5,
      item_height: 100,
      item_click_func: (list, index) => {
        this.state.logger.log(index)
      },
      item_bg_color: 0xffffff
    })
  }
})
