import * as hmUI from '@zos/ui'
import { log as Logger } from '@zos/utils'
import {
  FETCH_BUTTON,
  FETCH_RESULT_TEXT,
} from "zosLoader:./index.[pf].layout.js"

const logger = Logger.getLogger("fetch_api")
const { messageBuilder } = getApp()._options.globalData

let textWidget
Page({
  state: {},
  build() {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...FETCH_BUTTON,
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

      if (!textWidget) {
        textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
          ...FETCH_RESULT_TEXT,
          text
        })
      } else {
        textWidget.setProperty(hmUI.prop.TEXT, text)
      }
    }).catch(res => {
    })
  },
})
