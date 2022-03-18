import { TITLE_TEXT_STYLE, TIPS_TEXT_STYLE, SCROLL_LIST } from './index.style'
import { readFileSync, writeFileSync } from './../../../utils/fs'
import { getScrollListDataConfig } from './../../../utils/index'

const logger = DeviceRuntimeCore.HmLogger.getLogger('todo-list-page')
const { messageBuilder } = getApp()._options.globalData

Page({
  state: {
    scrollList: null,
    tipText: null,
    dataList: readFileSync(),
  },
  onMessage() {
    messageBuilder.on('call', ({ payload: buf }) => {
      const json = messageBuilder.buf2Json(buf)
      this.state.dataList = json.map((d) => ({ name: d }))
      this.createAndUpdateList()
    })
  },
  getTodoList() {
    messageBuilder
      .request({
        jsonrpc: 'hmrpcv2',
        method: 'GET_TODO_LIST',
        params: {},
      })
      .then(({ result }) => {
        this.state.dataList = result.map((d) => ({ name: d }))
        this.createAndUpdateList()
      })
      .catch((res) => {})
  },
  onInit() {
    logger.debug('page onInit invoked')
    this.onMessage()
    this.getTodoList()
  },
  build() {
    logger.debug('page build invoked')
    hmUI.createWidget(hmUI.widget.TEXT, { ...TITLE_TEXT_STYLE })
    this.createAndUpdateList()
  },
  changeUI() {
    const { dataList } = this.state
    if (dataList.length === 0) {
      !this.state.tipText &&
        (this.state.tipText = hmUI.createWidget(hmUI.widget.TEXT, {
          ...TIPS_TEXT_STYLE,
        }))
    }
    this.showOrHideWidget(dataList.length === 0)
  },
  showOrHideWidget(isTip) {
    this.state.tipText &&
      this.state.tipText.setProperty(hmUI.prop.VISIBLE, isTip)
    this.state.scrollList &&
      this.state.scrollList.setProperty(hmUI.prop.VISIBLE, !isTip)
  },
  createAndUpdateList() {
    const _scrollListItemClick = (list, index) => {}
    const { scrollList, dataList } = this.state
    this.changeUI()
    const dataTypeConfig = getScrollListDataConfig(
      dataList.length === 0 ? -1 : 0,
      dataList.length,
    )
    if (scrollList) {
      scrollList.setProperty(hmUI.prop.UPDATE_DATA, {
        data_array: dataList,
        data_count: dataList.length,
        data_type_config: dataTypeConfig,
        data_type_config_count: dataTypeConfig.length,
        on_page: 1,
      })
    } else {
      this.state.scrollList = hmUI.createWidget(hmUI.widget.SCROLL_LIST, {
        ...(SCROLL_LIST || {}),
        data_array: dataList,
        data_count: dataList.length,
        data_type_config: dataTypeConfig,
        data_type_config_count: dataTypeConfig.length,
        on_page: 1,
        item_click_func: _scrollListItemClick,
      })
    }
  },
  onDestroy() {
    logger.debug('page onDestroy invoked')
    writeFileSync(this.state.dataList, false)
  },
})
