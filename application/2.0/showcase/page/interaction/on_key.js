import { prop } from '@zos/ui'
import { onKey, KEY_SHORTCUT } from '@zos/interaction'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'onKey'
  },
  build() {
    const textByLine = new TextByLine()

    const text = textByLine.render({
      text: `key & action`
    })

    onKey({
      callback: (key, action) => {
        text.setProperty(prop.MORE, {
          text: `key: ${key};action: ${action}`
        })

        if (key === KEY_SHORTCUT) {
          this.state.logger.log('key shortcut')
        }

        return true
      }
    })
  }
})

