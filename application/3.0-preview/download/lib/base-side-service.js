import { device } from './side-message'
import { downloader } from './side-download-file'
import { fileTransferLib } from './side-file-transfer'

function addBaseURL(opts) {
  const params = {
    timeout: 60000,
    ...opts
  }

  params.url = new URL(opts.url, params.baseURL).toString()

  return params
}

export function BaseSideService(initParams) {
  return {
    state: {},
    ...initParams,
    onInit(opts) {
      this._onCall = this.onCall?.bind(this)
      this._onRequest = this.onRequest?.bind(this)
      device.onCall(this._onCall).onRequest(this.__onRequest.bind(this))

      this._onReceivedFile = this.onReceivedFile?.bind(this)
      fileTransferLib.onFile(this._onReceivedFile)


      device.start()
      initParams.onInit?.apply(this, opts)
    },
    onRun(opts) {
      initParams.onRun?.apply(this, opts)
      Object.entries(initParams).forEach(([k, v]) => {
        if (k === 'onRun') {
          return
        }

        if (typeof k === 'string' && k.startsWith('onRun')) {
          v.apply(this, opts)
        }
      })
    },
    onDestroy(opts) {
      if (this._onCall) {
        device.offOnCall(this._onCall)
      }

      if (this._onRequest) {
        device.offOnRequest(this._onRequest)
      }

      device.stop()

      if (this._onReceivedFile) {
        fileTransferLib.offFile(this._onReceivedFile)
      }

      initParams.onDestroy?.apply(this, opts)
    },
    request(data) {
      return device.request(data)
    },
    call(data) {
      return device.call(data)
    },
    fetch(opt) {
      return fetch(addBaseURL(opt))
    },
    sendFile(path, opts) {
      return fileTransferLib.sendFile(path, opts)
    },
    download(url, opts = {}) {
      return downloader.download(url, opts)
    },
    __onRequest(req, res) {
      if (req.method === 'http.request') {
        return this.httpRequestHandler(req, res)
      } else {
        return this._onRequest(req, res)
      }
    },
    httpRequestHandler(req, res) {
      return this.fetch(req.params)
        .then((result) => {
          res(null, {
            status: result.status,
            statusText: result.statusText,
            headers: result.headers,
            body: result.body
          })
        })
        .catch((e) => {
          return res({
            code: 1,
            message: e.message
          })
        })
    }
  }
}
