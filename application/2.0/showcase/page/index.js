import { push } from '@zos/router'
import { APITree } from '../config/tree'
import ButtonList from '../utils/UI/ButtonList'
import PageAdvanced from '../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    params: null,
    buttonList: null
  },
  onInit(params) {
    this.state.logger.log('params', params)

    try {
      this.state.params = JSON.parse(params)
    } catch (error) {
      this.state.params = {
        path: []
      }
    }
  },
  build() {
    this.state.logger.log('build')

    const { path = [] } = this.state.params
    const currentTree = path.reduce((prev, curr) => {
      return prev[curr]
    }, APITree)

    this.state.logger.log('currentTree', currentTree)

    const list = Object.keys(currentTree).map((key) => {
      return {
        text: key,
        path: currentTree[key].page || ''
      }
    })

    this.state.buttonList = new ButtonList({
      list,
      absolute_y: px(40),
      click_func: (i, index) => {
        this.state.logger.log('i', i)
        this.state.logger.log('index', index)

        const { text, path } = i

        if (path) {
          this.state.logger.log('path', path)
          this.state.logger.log('final path', `page/${this.state.params.path.join('/')}/${path}`)
          push({
            url: `page/${this.state.params.path.join('/')}/${path}`
          })
        } else {
          push({
            url: 'page/index',
            params: {
              path: [...this.state.params.path, text]
            }
          })
        }
      }
    })

    this.state.buttonList.render()
  }
})
