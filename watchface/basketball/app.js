import './shared/device-polyfill'

const logger = Logger.getLogger('basketball-app')

App({
  globalData: {},
  onCreate() {
    logger.log('app on create invoke')
  },
  onDestroy() {
    logger.log('app on destroy invoke')
  },
})
