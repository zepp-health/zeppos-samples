export function getFileTransfer(fileTransfer) {
  return {
    onFile(cb) {
      if (!cb) {
        return this;
      }

      if (typeof fileTransfer === "undefined") {
        return this;
      }

      fileTransfer.inbox.on("newfile", function () {
        const file = fileTransfer.inbox.getNextFile();
        cb && cb(file);
      });
      return this;
    },
    offFile() {
      if (typeof fileTransfer === "undefined") {
        return this;
      }

      fileTransfer.inbox.off("newfile");
      fileTransfer.inbox.off("file");
      return this;
    },
    cancelFile(file) {
      if (typeof fileTransfer === "undefined") {
        return this;
      }

      return fileTransfer.inbox.cancel(file);
    },
    getFile() {
      if (typeof fileTransfer === "undefined") {
        return null;
      }

      return fileTransfer.inbox.getNextFile();
    },
    sendFile(path, opts) {
      if (typeof fileTransfer === "undefined") {
        throw new Error("fileTransfer is not available");
      }

      return fileTransfer.outbox.enqueueFile(path, opts);
    },
  };
}
