import LocalStorage from './utils/storage'

const logger = DeviceRuntimeCore.HmLogger.getLogger('calories-app')
const fileName = 'calorie_data.txt'

App({
  globalData: {
    foodType: 'chocolate',
    localStorage: null
  },
  onCreate() {
    try {
      this.globalData.localStorage = new LocalStorage(fileName)
      const { foodType = 'chocolate' } = this.globalData.localStorage.get()
      this.globalData.foodType = foodType
      
    } catch (e) {
      logger.log('--->e:', e)
    }
  },

  onDestroy() {
    this.globalData.localStorage.set({
      foodType: getApp()._options.globalData.foodType
    })
  },
})
