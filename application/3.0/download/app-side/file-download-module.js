const logger = Logger.getLogger("network-download");

function fileNameStamp() {
  const d = new Date();
  return d.getTime();
}

export const fileDownloadModule = {
  async onRunFileDownload() {
    logger.log("download run");
  },
  downloadFile(url) {
    const task = this.download(url, {
      headers: {},
      timeout: 60000,
      filePath: `${fileNameStamp()}.png`,
    });

    if (!task) {
      this.call({
        message: "download fail",
      });
      return;
    }

    task.onSuccess = (data) => {
      logger.log("download success", data, this.call);
      this.call({
        result: {
          filePath: data.filePath,
        },
      });
    };

    task.onFail = (data) => {
      logger.log("download fail", data);
      this.call({
        result: {
          message: "download fail",
        },
      });
    };

    task.onComplete = () => {
      logger.log("download complete");
    };

    task.onProgress = (data) => {
      logger.log("download progress", data);
    };

    return task;
  },
};
