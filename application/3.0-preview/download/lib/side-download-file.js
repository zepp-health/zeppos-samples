export const downloader = {
  download(url, opts) {
    if (typeof network === "undefined") return;

    const task = network.downloader.downloadFile({
      url,
      ...opts,
    });

    return task;
  },
};
