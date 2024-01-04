import { event } from '@zos/ui'
import { createModal, MODAL_CONFIRM } from '@zos/interaction'
import PageAdvanced from '../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'createModal'
  },
  build() {
    const dialog = createModal({
      content: 'hello world',
      autoHide: false,
      onClick: (keyObj) => {
        console.log('type', keyObj.type)
        if (keyName === MODAL_CONFIRM) {
          console.log('confirm')
        } else {
          console.log('close')
          dialog.show(false)
        }
      }
    })

    this.state.titleWidget.addEventListener(event.CLICK_DOWN, () => {
      dialog.show(true)
    })
  }
})
