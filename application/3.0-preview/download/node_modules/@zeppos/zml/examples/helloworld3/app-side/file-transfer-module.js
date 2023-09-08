const logger = Logger.getLogger('test-file-transfer')

export const fileTransferModule = {
  onRunFileTransfer() {
    logger.log('fileTransferTest run')
  },
  testTransferFile1() {
    const task =  this.sendFile('data://download/logo.png', { type: 'image' })

    task.on("progress", (e) => {
      logger.log('task1 progress', e)
    })

    task.on("change", (e) => {
      logger.log('task1 change', e)
    })

    return task
  },
  testTransferFile2() {
    const task = this.sendFile('data://download/converted_logo2.png', {
      type: 'image',
    })

    task.on("progress", (e) => {
      logger.log('task2 progress', e)
    })

    task.on("change", (e) => {
      logger.log('task2 change', e)
    })

    return task
  },
}
