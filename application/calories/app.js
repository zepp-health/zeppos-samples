const logger = DeviceRuntimeCore.HmLogger.getLogger('calories-app')
const fileName = 'calorie_calculator_data.txt'

App({
  globalData: {
    foodType: 'chocolate',
  },
  onCreate() {
    try {
      const globalData = getApp()._options.globalData
      const [fsStat, err] = hmFS.stat(fileName)
      if (err == 0) {
        logger.log('--->size:', fsStat.size)
        const fileContentUnit = new Uint8Array(fsStat.size)
        const file = hmFS.open(fileName, hmFS.O_RDWR)
        hmFS.seek(file, 0, hmFS.SEEK_SET)
        hmFS.read(file, fileContentUnit.buffer, 0, fileContentUnit.length)
        hmFS.close(file)

        globalData.foodType = JSON.parse(
          String.fromCharCode.apply(null, fileContentUnit),
        ).foodType
      }
    } catch (e) {
      logger.log('--->e:', e)
    }
  },

  onDestroy() {
    const globalData = getApp()._options.globalData
    const file = hmFS.open(fileName, hmFS.O_RDWR | hmFS.O_CREAT)
    const content = DeviceRuntimeCore.Buffer.from(
      JSON.stringify({ foodType: globalData.foodType }),
      'utf-8',
    )
    hmFS.write(file, content.buffer, 0, content.byteLength)
    hmFS.close(file)
  },
})
