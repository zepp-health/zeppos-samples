const logger = Logger.getLogger('test-message-fetch')

export const fetchModule = {
  async onRunFetch() {
    logger.log('fetchTest run')
  },
  async testGetHtml2() {
    const result = await this.fetch({
      method: 'get',
      url: 'http://yijuzhan.com/api/word.php',
    }).catch((e) => {
      console.log('test fetch=>', e)
    })

    logger.log('testphp', result.body)

    return result.body
  },
}
