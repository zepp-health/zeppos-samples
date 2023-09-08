const logger = Logger.getLogger("file-transfer");

export const fileTransferModule = {
  onRunFileTransfer() {
    logger.log("fileTransfer run");
  },
  transferFile(url, opt) {
    const task = this.sendFile(url, opt);

    task.on("progress", (e) => {
      logger.log("task progress", e);
    });

    task.on("change", (e) => {
      logger.log("task change", e);
    });

    return task;
  },
};
