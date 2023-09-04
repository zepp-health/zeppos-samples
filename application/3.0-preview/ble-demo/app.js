import { EventBus } from '@zos/utils'

App({
  globalData: {
    devEvent: new EventBus()
  },
  onCreate(options) {
    console.log('app on create invoke')
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})
