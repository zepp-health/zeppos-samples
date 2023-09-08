import { convertLib } from "@zeppos/zml/base-side";

const logger = Logger.getLogger("image-convert");

export const imageConvertModule = {
  async onRunImageConvert() {
    logger.log("imageConvert run");
  },
  async convert(filePath) {
    const result = await convertLib.convert({
      filePath: filePath,
      targetFilePath: filePath,
    });

    logger.log("ConvertImage result=>%j", result);
    return result;
  },
};
