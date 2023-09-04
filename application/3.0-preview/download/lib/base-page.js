import { getDeviceMessage } from './device-message'
import { fileTransferLib } from './device-file-transfer'

export function BasePage({ state, onInit, onDestroy, ...other }) {
  const device = getDeviceMessage()

  return {
    state,
    ...other,
    onInit(...opts) {
      this._onCall = this.onCall?.bind(this)
      this._onRequest = this.onRequest?.bind(this)
      device.onCall(this._onCall).onRequest(this._onRequest)

      if (this.onReceivedFile) {
        this._onReceivedFile = this.onReceivedFile?.bind(this)
        fileTransferLib.onFile(this._onReceivedFile)
      }

      onInit && onInit.apply(this, opts)
    },
    onDestroy(...opts) {
      if (this._onCall) {
        device.offOnCall(this._onCall)
      }

      if (this._onRequest) {
        device.offOnRequest(this._onRequest)
      }

      if (this._onReceivedFile) {
        fileTransferLib.offFile(this._onReceivedFile)
      }

      onDestroy && onDestroy.apply(this, opts)
    },
    request(data, opt) {
      return device.request(data, opt)
    },
    httpRequest(data) {
      return device.request({
        method: 'http.request',
        params: data
      })
    },
    call(data) {
      return device.call(data)
    },
    cancelFile(file) {
      return fileTransferLib.cancelFile(file)
    },
    sendFile(path, opts) {
      return fileTransferLib.sendFile(path, opts)
    }
  }
}
