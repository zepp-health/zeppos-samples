import { BasePage } from '@zeppos/zml/base-page'
import { log as Logger } from '@zos/utils'
import { layout } from 'zosLoader:./index.[pf].layout.js'

const logger = Logger.getLogger('ble-fileTransfer.page')

Page(
  BasePage({
    name: 'ble.page',
    state: {
      file: '',
    },
    build() {
      logger.log('page build invoked')
      layout.render(this)
    },

    onInit() {
      logger.log('page onInit invoked')
      // logger.log('transferFile =>', typeof ble.transferFile)
    },

    onDestroy() {
      logger.log('page onDestroy invoked')
    },

    fileToSide() {
      const file = this.sendFile('data://download/logo.png')
      this.state.file = file

      file.on('progress', (progress) => {
        logger.log('progress=> %j', progress)
        layout.updateProgress({
          fileName: file.fileName,
          progress: Math.round(
            (progress.data.loadedSize / progress.data.fileSize) * 100,
          ),
        })
      })
      return file
    },

    cancelFile() {
      if (this.state.file) {
        this.state.file.cancel()
        this.state.file = null
      }
    },

    onReceivedFile(file) {
      logger.log('file received %s', file.toString())
      this.state.file = file

      file.on('progress', (progress) => {
        logger.log('file progress => %j', {
          totalSize: progress.data.fileSize,
          loadedSize: progress.data.loadedSize,
        })

        layout.updateProgress({
          fileName: file.fileName,
          progress: Math.round(
            (progress.data.loadedSize / progress.data.fileSize) * 100,
          ),
        })
      })

      file.on('change', (event) => {
        logger.log('file status =>', event.data.readyState)
        if (event.data.readyState === 'transferred') {
          layout.updateTxtSuccess(JSON.stringify(file))
          const userData = file.params
          if (userData.type === 'image') {
            layout.updateImgSrc(file.filePath)
          }
        }
      })
    },
  }),
)
