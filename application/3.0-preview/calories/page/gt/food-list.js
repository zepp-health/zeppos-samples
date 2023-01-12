import { log as Logger } from '@zos/utils'
import { back } from '@zos/router'
import { layout } from 'zosLoader:./[name].[pf].layout.js'
import { FOOD_CALORIES } from '../../utils/constants'

const globalData = getApp()._options.globalData
const logger = Logger.getLogger('calories')
Page({
  state: {
    activeIndex: -1,
    isFinishInit: false,
    radioGroup: null,
    radioButtonsArray: [],
  },
  setPrograms(index) {
    this.state.activeIndex = index
    globalData.foodType = FOOD_CALORIES[index].type
    back()
  },
  build() {
    logger.debug('page build invoked')
    layout.render(this)
  },
  onInit() {
    logger.debug('page onInit invoked')
  },

  onDestroy() {
    logger.debug('page onDestroy invoked')
  },
})
