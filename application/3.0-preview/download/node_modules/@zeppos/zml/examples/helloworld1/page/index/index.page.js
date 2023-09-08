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

    getDataFromNetwork() {
      this.httpRequest({
        method: 'get',
        url: 'http://yijuzhan.com/api/word.php',
      }).then((result) => {
        logger.log('result.status=>', JSON.stringify(result.status))
        logger.log('result.statusText=>', JSON.stringify(result.statusText))
        logger.log('result.headers=>', JSON.stringify(result.headers))
        logger.log('result.body=>', JSON.stringify(result.body))
      })
    },

    onDestroy() {
      logger.log('page onDestroy invoked')
    },
  }),
)
