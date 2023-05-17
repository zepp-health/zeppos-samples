import { prop } from '@zos/ui'
import { onDigitalCrown } from '@zos/interaction'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'onDigitalCrown'
  },
  build() {
    const textByLine = new TextByLine()

    const text = textByLine.render({
      text: `KEY;DEGREE:`
    })

    onDigitalCrown({
      callback: (key, degree) => {
        this.state.logger.log(key, degree)
        text.setProperty(prop.MORE, {
          text: `KEY:${key};DEGREE:${degree}`
        })
      }
    })
  }
})
