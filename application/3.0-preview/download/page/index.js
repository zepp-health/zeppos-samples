import hmUI from '@zos/ui'
import { log as Logger } from '@zos/utils'
import { getText } from '@zos/i18n'
import { BasePage } from './../lib/base-page'
import * as Styles from 'zosLoader:./index.[pf].layout.js'
import { createPressedBtn } from '../components/pressed-btn'

import { getResourcePath } from './../utils/index'
const logger = Logger.getLogger('download page')

let textWidget
Page(BasePage({
  state: {
    isDownload: false,
    isTransfer: false,
    filePath: '',
    fileName: ''
  },
  onCall({ result }) {
    if (result && 'filePath' in result) {
      this.state.filePath = result.filePath
      this.state.isDownload = false
      textWidget.setProperty(hmUI.prop.TEXT, getText('transTip'))
    }
  },
  onReceivedFile(fileHandler) {
    logger.debug('file received %s', fileHandler.toString())

    fileHandler.on('progress', (progress) => {
      const { loadedSize: loaded, fileSize: total } = progress.data
      const numProgress = loaded === total ? 100 : Math.floor((loaded * 100) / total)
      logger.debug('file progress === ==>', numProgress)
      if (numProgress === 100) {
        this.state.isTransfer = false
        this.state.fileName = fileHandler.fileName
        const path = getText('imagePath', getResourcePath(this.state.fileName))
        textWidget.setProperty(hmUI.prop.TEXT, path)
      }
    })

    fileHandler.on('change', (event) => {
      logger.debug('file status === ==>', event.data.readyState)
      if (event.data.readyState === 'transferred') {
        logger.debug('COVER file transfer success ===> ', fileHandler.filePath)
        this.state.isTransfer = false
        this.state.fileName = fileHandler.fileName
      }
    })
  },
  build() {
    textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      ...Styles.TIPS_STYLE,
      text: getText('downloadTip')
    })

    createPressedBtn(Styles.DOWNLOAD_BTN, () => {
      console.log('--->click')
      if (this.state.isDownload) return
      if (this.state.filePath) return
      this.state.isDownload = true
      textWidget.setProperty(hmUI.prop.TEXT, getText('downloadingTip'))

      this.request({
        method: 'img.cover',
        params: ''
      })
        .then((result) => {
        })
        .catch((error) => {
          logger.error('error=>%j', error)
          this.state.isDownload = false
          textWidget.setProperty(hmUI.prop.TEXT, getText('downloadFailTip'))
        })
    }, hmUI)


    createPressedBtn(Styles.TRANS_BTN, () => {
      if (this.state.isTransfer) return
      if (!this.state.filePath) return
      if (this.state.fileName) return
      this.state.isTransfer = true
      textWidget.setProperty(hmUI.prop.TEXT, getText('transingTip'))

      this.request({
        method: 'img.trans',
        params: {
          filePath: this.state.filePath
        }
      })
        .then((result) => {
        })
        .catch((error) => {
          logger.error('error=>%j', error)
          this.state.isTransfer = false
          textWidget.setProperty(hmUI.prop.TEXT, getText('transFailTip'))
        })
    }, hmUI)
  }
}))
