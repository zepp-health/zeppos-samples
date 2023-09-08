import { convertLib } from '@zeppos/zml/base-side'

const logger = Logger.getLogger('test-image-convert')

export const imageConvertModule = {
  async onRunImageConvert() {
    logger.log('imageConvertTest run')
  },
  async testConvertImage1() {
    // data://temp/logo.png_converted
    const result = await convertLib.convert({
      filePath: 'data://download/logo.png',
    })

    logger.log('ConvertImage result=>%j', result)
  },
  async testConvertImage2() {
    // data://download/converted_logo2.png
    const result = await convertLib.convert({
      filePath: 'data://download/logo2.png',
      targetFilePath: 'data://download/converted_logo2.png',
    })

    logger.log('ConvertImage result=>%j', result)
  },
}
