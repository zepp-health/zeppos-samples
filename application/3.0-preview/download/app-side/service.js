import { convertLib } from "../lib/side-convert-image";
import { Logger } from "./logger";

const logger = Logger.getLogger("MP-SS");

function fileNameStamp() {
  const d = new Date();
  return d.getTime();
}

class ActionDispatch {
  // vm is the real page object
  constructor({ req, res }, vm) {
    this.req = req;
    this.res = res;
    this.vm = vm;
  }

  async dispatch() {
    const action = this.req.method.split(".")[1];
    const params = this.req.params || {};

    const func = this[`${action}Action`] || function () {};
    func.call(this, params);
  }

  success(data) {
    logger.log("====== send SUCCESS =====", data);
    return this.res(null, {
      status: "success",
      data,
    });
  }

  error(msg) {
    return this.res(null, {
      status: "error",
      message: msg,
    });
  }

  async coverAction(data) {
    const { coverUrl = "https://docs.zepp.com/zh-cn/img/logo.png" } = data;
    if (coverUrl !== "") {
      logger.log("cover ========> ", coverUrl);
      this.vm.downloadCover(encodeURI(coverUrl));
      this.success("");
    }
  }

  async transAction(data) {
    const { filePath } = data;
    logger.log("start covert img");
    const result = await convertLib.convert({
      filePath: filePath,
      targetFilePath: filePath,
    });

    logger.log("ConvertImage result=>%j", result);
    this.success("");
    this.vm.sendCover(data.filePath, { type: "jpg", name: "cover.jpg" });
  }
}

// page vm instance
export const serviceModule = {
  async service(req, res) {
    const actDispatch = new ActionDispatch({ req, res }, this);
    actDispatch.dispatch();
  },
  downloadCover(url) {
    const $this = this;
    logger.log("in download mp3 cover ==== > ", url);

    const task = this.download(url, {
      headers: {},
      timeout: 600000,
      filePath: `${fileNameStamp()}.jpg`,
    });

    if (!task) {
      $this.call({
        message: "download fail",
      });
      return;
    }

    task.onSuccess = async function (data) {
      logger.log("download success", data);
      $this.call({
        result: {
          filePath: data.filePath,
        },
      });
    };

    task.onFail = function (data) {
      logger.log("download fail", data);
      $this.call({
        result: {
          message: "download fail",
        },
      });
    };

    task.onComplete = function () {
      logger.log("download complete");
    };

    task.onProgress = function (data) {
      logger.log("download progress", data);
    };

    return task;
  },
  sendCover(url, opt) {
    const task = this.sendFile(url, opt);

    task.on("process", function (data) {
      logger.log("Send Cover progress ==== > ", data);
    });

    task.on("change", function (data) {
      logger.log("Send Cover change ==== > ", data);
    });
  },
};
