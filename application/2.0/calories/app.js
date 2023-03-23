import { log as Logger } from '@zos/utils'
import { localStorage } from '@zos/storage'

const logger = Logger.getLogger('calories-app')

App({
  globalData: {
    foodType: '',
  },
  onCreate() {
    try {
      const { foodType = 'chocolate' } = localStorage.getItem('calorie', {})
      this.globalData.foodType = foodType

    } catch (e) {
      logger.log('--->e:', e)
    }
  },

  onDestroy() {},
})
