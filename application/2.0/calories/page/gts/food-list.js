import { createWidget, widget, event, prop } from '@zos/ui'
import { back } from '@zos/router'
import { log as Logger, px } from '@zos/utils'
import { localStorage } from '@zos/storage'

import {
  FOOD_LIST_Y,
  FOOD_LIST_ITEM_MARGIN,
  FOOD_LIST_ITEM_HEIGHT,
  FOOD_LIST_RADIOGROUP,
  FOOD_LIST_RADIO_ITEM,
  FOOD_LIST_RADIO_ITEM_TEXT,
  DEVICE_WIDTH,
} from '../../utils/styles-gts-3'
import { FOOD_CALORIES } from '../../utils/constants'
const logger = Logger.getLogger('calories')
const globalData = getApp()._options.globalData

Page({
  state: {
    activeIndex: -1,
    isFinishInit: false,
    radioGroup: null,
    radioButtonsArray: [],
  },
  onInit() {
    logger.log('onInit')
  },
  setPrograms(index) {
    this.state.activeIndex = index
    globalData.foodType = FOOD_CALORIES[index].type
    localStorage.setItem('calorie', {
      foodType: globalData.foodType
    })
    back()
  },
  buildFoodList() {
    let activeIndex = 0
    const radioGroup = createWidget(widget.RADIO_GROUP, {
      ...FOOD_LIST_RADIOGROUP,
      check_func: (group, index, checked) => {
        if (checked) {
          this.state.isFinishInit && this.setPrograms(index)
        }
      },
    })

    this.state.radioGroup = radioGroup

    for (let index = 0; index < FOOD_CALORIES.length; index++) {
      this.buildRadioButton(index)
      this.buildRadioText(index)
      activeIndex =
        FOOD_CALORIES[index].type === globalData.foodType ? index : activeIndex
    }
    this.state.activeIndex = activeIndex
    this.initRadioGroup()
  },
  buildElement() {
    createWidget(widget.FILL_RECT, {
      x: 0,
      y: 0,
      w: DEVICE_WIDTH,
      h: px(
        FOOD_LIST_Y +
          (FOOD_CALORIES.length + 1) *
            (FOOD_LIST_ITEM_HEIGHT + FOOD_LIST_ITEM_MARGIN),
      ),
    })
    this.buildFoodList()
  },
  buildRadioButton(index) {
    const radio = this.state.radioGroup.createWidget(widget.STATE_BUTTON, {
      ...FOOD_LIST_RADIO_ITEM.styles,
      y: px(index * (FOOD_LIST_ITEM_HEIGHT + FOOD_LIST_ITEM_MARGIN)),
    })
    this.state.radioButtonsArray.push(radio)
  },
  buildRadioText(index) {
    const text = createWidget(widget.TEXT, {
      ...FOOD_LIST_RADIO_ITEM_TEXT,
      y: px(
        FOOD_LIST_Y + index * (FOOD_LIST_ITEM_HEIGHT + FOOD_LIST_ITEM_MARGIN),
      ),
      text: `${FOOD_CALORIES[index].name[0].toUpperCase()}${FOOD_CALORIES[
        index
      ].name.slice(1)}`,
    })
    text.addEventListener(event.SELECT, () => {
      this.state.radioGroup.setProperty(
        prop.CHECKED,
        this.state.radioButtonsArray[index],
      )
    })
  },
  initRadioGroup() {
    this.state.radioGroup.setProperty(
      prop.INIT,
      this.state.radioButtonsArray[0],
    )
    this.state.radioGroup.setProperty(
      prop.CHECKED,
      this.state.radioButtonsArray[this.state.activeIndex],
    )
    this.state.isFinishInit = true
  },
  build() {
    this.buildElement()
  },
  onReady() {},

  onShow() {},

  onHide() {},

  onDestroy() {},
})
