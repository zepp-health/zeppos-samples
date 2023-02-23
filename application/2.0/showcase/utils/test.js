import logger from './log'
import { createWidget, widget } from '@zos/ui'

export default class Test {
  constructor() {
    this.callTime = 0
    this.testResult = true
  }

  expect(result) {
    this.callTime++

    if (result === false) {
      logger('error call time', this.callTime)
    }

    if (result === false) {
      this.testResult = false
    }
    this.checkResult()
  }

  checkResult() {
    createWidget(widget.IMG, {
      x: px(20),
      y: px(20),
      src: this.testResult ? 'true.png' : 'false.png'
    })
  }
}
