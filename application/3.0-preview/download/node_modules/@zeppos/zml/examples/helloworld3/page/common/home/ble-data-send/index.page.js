import { BasePage } from '@zeppos/zml/base-page'
import { log as Logger } from '@zos/utils'
import { layout } from 'zosLoader:./index.[pf].layout.js'

const logger = Logger.getLogger('ble-send-data.page')

Page(
  BasePage({
    name: 'ble.page',
    state: {},
    build() {
      logger.log('page build invoked')
      layout.render(this)
    },

    onInit() {
      logger.log('page onInit invoked')
    },

    readAsync() {
      return this.request({
        method: 'test.read',
        params: {
          start: 1,
        },
      })
        .then((result) => {
          layout.updateTxtSuccess(result.data)
          logger.log('result=>%j', result)
        })
        .catch((error) => {
          layout.updateTxtError(error.message)
          logger.error('error=>%j', error)
        })
    },

    onDestroy() {
      logger.log('page onDestroy invoked')
    },
  }),
)
