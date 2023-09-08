import { BasePage } from '@zeppos/zml/base-page'
import { log as logger } from '@zos/utils'
import { layout } from 'zosLoader:./index.[pf].layout.js'
import { push } from '@zos/router'

Page(
  BasePage(
  {
    name: 'index.page',
    state: {
      a: 1
    },
    build() {
      layout.render(this)
    },

    onInit() {
      logger.log('page onInit invoked')
    },

    goBlePage() {
      push({
        url: 'page/common/home/ble-data-send/index.page',
      })
    },

    goBleHttp() {
      push({
        url: 'page/common/home/ble-http-proxy/index.page',
      })
    },

    goFilePage() {
      push({
        url: 'page/common/home/ble-file-transfer/index.page',
      })
    },

    onDestroy() {
      logger.log('page onDestroy invoked')
    },
  }
  ),
)
