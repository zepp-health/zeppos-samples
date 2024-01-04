import { event } from '@zos/ui'
import { showToast } from '@zos/interaction'
import PageAdvanced from '../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'showToast'
  },
  build() {
    this.state.titleWidget.addEventListener(event.CLICK_DOWN, () => {
      showToast({
        content: 'Hello ZeppOS'
      })
    })
  }
})

