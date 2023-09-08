import { BaseSideService } from "@zeppos/zml/base-side";

import { fileDownloadModule } from "./file-download-module";
import { fileTransferModule } from "./file-transfer-module";
import { fetchModule } from "./fetch-module";
import { imageConvertModule } from "./image-convert-module";

const logger = Logger.getLogger("message-app-side");

AppSideService(
  BaseSideService({
    ...fetchModule,
    ...fileDownloadModule,
    ...imageConvertModule,
    ...fileTransferModule,
    onInit() {
      logger.log("app side service invoke onInit");
    },
    onRun() {
      logger.log("app side service invoke onRun");
    },
    onDestroy() {
      logger.log("app side service invoke onDestroy");
    },
    onReceivedFile(file) {
      logger.log("received file:=> %j", file);
    },
    async onRequest(req, res) {
      const [, action] = req.method.split(".");
      switch (action) {
        case "cover": {
          const { coverUrl = "https://docs.zepp.com/zh-cn/img/logo.png" } =
            req.params || {};
          this.downloadFile(encodeURI(coverUrl));
          res(null, {
            status: "success",
            data: "",
          });
          break;
        }
        case "trans": {
          const { filePath } = req.params;
          logger.log("start covert img");
          await this.convert(filePath);
          res(null, {
            status: "success",
            data: "",
          });
          this.transferFile(filePath, { type: "png", name: filePath });
          break;
        }
        default: {
          res({
            status: "error",
            message: "unknown action",
          });
        }
      }
    },
  })
);
