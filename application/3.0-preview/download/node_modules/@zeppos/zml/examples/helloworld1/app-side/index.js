import { BaseSideService } from '@zeppos/zml/base-side'
const logger = Logger.getLogger('test-message-app-side')

AppSideService(
  BaseSideService({
    onInit() {
      logger.log('app side service invoke onInit')
    },
    onRun() {
      logger.log('app side service invoke onRun')
    },
    onDestroy() {
      logger.log('app side service invoke onDestroy')
    },
  }),
)
