import { createWidget, widget, prop, event } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'CYCLE_IMAGE_TEXT_LIST'
  },

  build() {
    const dataArray = [
      { text: '0', src: 'true.png' },
      { text: '1' },
      { text: '2' },
      { text: '3', src: 'false.png' },
      { text: '4' },
      { text: '5' },
      { text: '6' },
      { text: '7' },
      { text: '8' },
      { text: '9' }
    ]

    const cycle_image_text_list = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
      x: 0,
      y: px(120),
      w: px(480),
      h: px(300),
      data_array: dataArray,
      data_size: 10,
      item_height: px(60),
      // item_bg_color: 0xffffff,
      item_text_color: 0xffffff,
      item_text_size: px(18),
      item_image_x: px(60)
    })

    this.state.titleWidget.addEventListener(event.CLICK_DOWN, () => {
      this.state.logger.log('property', cycle_image_text_list.getProperty(prop.MORE, {}))
      cycle_image_text_list.setProperty(prop.LIST_TOP, { index: 3 })
    })
  }
})
