const logger = Logger.getLogger('test-network-download')

export const fileDownloadModule = {
  async onRunFileDownload() {
    logger.log('downloadTest run')
  },
  testDownloadFile1() {
    // data://download/logo.png
    const task = this.download('https://docs.zepp.com/zh-cn/img/logo.png', {
      headers: {},
      timeout: 6000,
    })

    task.onSuccess = function (data) {
      logger.log('downloadTest success', data)
    }

    task.onFail = function (data) {
      logger.log('downloadTest fail', data)
    }

    task.onComplete = function () {
      logger.log('downloadTest complete')
    }

    task.onProgress = function (data) {
      logger.log('downloadTest progress', data)
    }

    return task
  },
  testDownloadFile2() {
    // data://download/logo2.png
    const task = this.download('https://docs.zepp.com/zh-cn/img/logo.png', {
      headers: {},
      timeout: 6000,
      filePath: 'logo2.png',
    })

    task.onSuccess = function (data) {
      logger.log('downloadTest2 success', data)
    }

    task.onFail = function (data) {
      logger.log('downloadTest2 fail', data)
    }

    task.onComplete = function () {
      logger.log('downloadTest2 complete')
    }

    task.onProgress = function (data) {
      logger.log('downloadTest2 progress', data)
    }

    return task
  },
}
