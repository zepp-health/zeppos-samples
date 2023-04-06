import { createWidget, widget, align, text_style } from '@zos/ui'
import { log as Logger, px } from '@zos/utils'
import {
  DEFAULT_COLOR,
  DEFAULT_COLOR_TRANSPARENT,
} from "../utils/config/constants"
import { DEVICE_WIDTH } from "../utils/config/device"

const logger = Logger.getLogger("fetch_api")
const { messageBuilder } = getApp()._options.globalData

Page({
  state: {},
  build() {
    createWidget(widget.BUTTON, {
      x: (DEVICE_WIDTH - px(400)) / 2,
      y: px(260),
      w: px(400),
      h: px(100),
      text_size: px(36),
      radius: px(12),
      normal_color: DEFAULT_COLOR,
      press_color: DEFAULT_COLOR_TRANSPARENT,
      text: "Fetch Data",
      click_func: (button_widget) => {
        logger.log("click button")
        this.fetchData()
      },
    })
  },
  fetchData() {
    messageBuilder.request({
      method: "GET_DATA",
    })
    .then(data => {
      logger.log('receive data')
      const { result = {} } = data
      const { text } = result

      createWidget(widget.TEXT, {
        x: px(50),
        y: px(100),
        w: DEVICE_WIDTH - 2 * px(50),
        h: px(46),
        color: 0xffffff,
        text_size: px(36),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        text
      })
    }).catch(res => {
    })
  },
})
