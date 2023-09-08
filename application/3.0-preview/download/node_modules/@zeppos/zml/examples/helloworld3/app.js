import { BaseApp } from '@zeppos/zml/base-app'
import { log } from '@zos/utils'
const logger = log.getLogger('test-message-1.0')

App(
  BaseApp({
    globalData: {
      a: 1
    },
    onCreate() {
      this.globalData.a = 2
      logger.log(this.globalData.a)
      logger.log('app test')
      this.test()
      this.test2()
    },
    onDestroy(opts) {
      this.globalData.a += 1
      this.globalData.a += 2
      logger.log('destroy=2',this.globalData.a)
      logger.log('app on destroy invoke')
    },
    test() {
      this.globalData.a += 1
      logger.log('test method')
    },
    test2() {
      logger.log('test2')
    }
  }),
)
