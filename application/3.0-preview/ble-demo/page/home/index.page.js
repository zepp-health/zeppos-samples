import * as hmUI from '@zos/ui'
import { setPageBrightTime } from '@zos/display'

import { BTN_STYLE, TEXT_STYLE } from 'zosLoader:./index.[pf].layout.js'
import { ab2Arr } from './../../utils/index'
import { startConnect, disConnect, scanDevice, stopScanDevice, offAll } from '../../utils/ble'

const { devEvent } = getApp()._options.globalData

Page({
  state: {
    name: 'Etekcity Smart Fitness Scale',  // device name
    isScan: false,
    connected: false,
    connectId: -1
  },
  build() {
    console.log('page build invoked')
    const btnWidget = hmUI.createWidget(hmUI.widget.BUTTON, {
      ...BTN_STYLE,
      text: 'start',
      click_func: () => {
        const { name, isScan, connected, connectId } = this.state
        if (connected) {
          disConnect(connectId)
          this.state.isScan = false
          this.state.connected = false
          this.state.connectId = -1
          btnWidget.setProperty(hmUI.prop.TEXT, 'start')
          textWidget && textWidget.setProperty(hmUI.prop.TEXT, '')
        } else if (!isScan) {
          scanDevice(name)
          this.state.isScan = true
          btnWidget.setProperty(hmUI.prop.TEXT, 'stop')
          textWidget && textWidget.setProperty(hmUI.prop.TEXT, `scan devices\n` + name + '...')
        } else if (!connected) {
          this.state.isScan = false
          btnWidget.setProperty(hmUI.prop.TEXT, 'start')
          textWidget && textWidget.setProperty(hmUI.prop.TEXT, '')
          offAll()
        }
      }
    })
    const textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...TEXT_STYLE,
      text: ''
    })

    devEvent.on('scan', (addr) => {
      console.log('---emit scan---')
      const devAddrArr = ab2Arr(addr).map(d => d.toString(16).toUpperCase())
      const devAddrStr = devAddrArr.join(':')
      console.log('---device mac---', devAddrStr)
      textWidget && textWidget.setProperty(hmUI.prop.TEXT, devAddrStr)
      stopScanDevice()
      startConnect(addr)
    })

    devEvent.on('data', (text) => {
      textWidget && textWidget.setProperty(hmUI.prop.TEXT, `data:${text.toString()}`)
    })

    devEvent.on('error', (text) => {
      this.state.isScan = false
      this.state.connected = false
      this.state.connectId = -1
      btnWidget.setProperty(hmUI.prop.TEXT, 'start')
      textWidget && textWidget.setProperty(hmUI.prop.TEXT, '')
    })
  },
  onInit() {
    console.log('page onInit invoked')
    setPageBrightTime({
      brightTime: 60000,
    })
  },
  destroy() {
    const { isScan, connected, connectId } = this.state
    if (connected) {
      disConnect(connectId)
    } else if (isScan) {
      stopScanDevice()
    }
    offAll()
    devEvent.on('error')
    devEvent.on('scan')
    devEvent.on('data')
  },
  onDestroy() {
    console.log('page onDestroy invoked')
    this.destroy()
  },
})