import { BaseApp } from '@zeppos/zml/base-app'
import { log as logger } from '@zos/utils'

App(
  BaseApp({
    globalData: {},
    onCreate() {
      logger.log('app on create invoke')
    },
    onDestroy() {
      logger.log('app on destroy invoke')
    },
  }),
)
