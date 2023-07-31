/**@note Visual Logger can only be used inside the @Page as the UI can't be drawn in @App */

App({
  globalData: {},
  onCreate(options) {
    console.log('onCreate invoked')
  },
  onDestroy(options) {
    console.log('onDestroy invoked')
  }
})