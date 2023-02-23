import { setStatusBarVisible } from '@zos/ui'
import { before } from '../utils'
import Title from '../UI/Title'
import logger from '../log'
import Test from '../test'

function PageAdvanced(args) {

  const { build } = args

  const beforeFn = function () {
    const { pageName = 'HELLO ZEPP OS' } = this.state

    const title = new Title({
      text: pageName
    })

    const titleWidget = title.render()
    this.state.titleWidget = titleWidget
    setStatusBarVisible(false)
  }

  const finalBuild = before(build, beforeFn)
  const test = new Test()

  Page({
    ...args,
    build: finalBuild,
    state: {
      logger,
      expect: test.expect.bind(test),
      ...args.state
    }
  })
}

export default PageAdvanced
