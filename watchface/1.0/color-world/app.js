import './shared/device-polyfill'

const logger = Logger.getLogger('color-world-app')

App({
  globalData: {},
  onCreate() {
    logger.log('app on create invoke')
  },
  onDestroy() {
    logger.log('app on destroy invoke')
  },
})
