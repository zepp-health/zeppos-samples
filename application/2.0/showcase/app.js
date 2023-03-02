import { setStatusBarVisible } from '@zos/ui'

App({
  globalData: {},
  onCreate(options) {
    console.log('app on create invoke')
    setStatusBarVisible(false)
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})
