import { BasePage } from '@zeppos/zml/base-page'
import { log as logger } from '@zos/utils'
import { layout } from 'zosLoader:./index.[pf].layout.js'

Page(
  BasePage({
    name: 'index.page',
    state: {},
    build() {
      layout.render(this)
    },

    onInit() {
      logger.log('page onInit invoked')
    },

    onDestroy() {
      logger.log('page onDestroy invoked')
    },

    getDataFromMobile() {
      return this.request({
        method: 'your.method1',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
        .then((result) => {
          // receive your data
          logger.log('result=>', JSON.stringify(result))
        })
        .catch((error) => {
          // receive your error
          logger.error('error=>', error)
        })
    },
    notifyMobile() {
      this.call({
        method: 'your.method3',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
    },

    sendCmd(cmd, params = {}) {
      this.call({
        method: cmd,
        params,
      })
    },

    onRequest(req, res) {
      // need reply
      // response is node style callback
      // first param is error
      // second param is your data
      logger.debug('req=>', JSON.stringify(req))
      if (req.method === 'your.method2') {
        // do something
        res(null, {
          test: 1,
        })
      } else {
        res('error happened')
      }
    },
    onCall(req) {
      // no reply
      logger.debug('call req=>', JSON.stringify(req))
      if (req.method === 'your.method4') {
        // do something
        logger.log('call req=>', JSON.stringify(req))
      }
    },
  }),
)
