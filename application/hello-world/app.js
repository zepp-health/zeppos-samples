const logger = DeviceRuntimeCore.HmLogger.getLogger('hello-world-app')

App({
  globalData: {},
  onCreate() {
    logger.debug('app onCreate invoked')
  },

  onDestroy() {
    logger.debug('app onDestroy invoked')
  },
})
