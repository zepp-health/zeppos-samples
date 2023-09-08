const logger = Logger.getLogger("message-fetch");

export const fetchModule = {
  async onRunFetch() {
    logger.log("fetch run");
  },
  async getPhpFile() {
    const result = await this.fetch({
      method: "get",
      url: "http://yijuzhan.com/api/word.php",
    }).catch((e) => {
      console.log("fetch=>", e);
    });

    logger.log("php", result.body);

    return result.body;
  },
};
