import hmUI from '@zos/ui'
import { getText } from '@zos/i18n'
import * as notificationMgr from '@zos/notification'
import * as Styles from 'zosLoader:./index.[pf].layout.js'

Page({
  build() {
    hmUI.createWidget(hmUI.widget.BUTTON, {
      ...Styles.BTN_STYLE,
      click_func: () => {
        notificationMgr.notify({
          title: getText('title'),
          content: getText('content'),
          actions: [
            {
              text: getText('later_min', 1),
              file: 'app-service/delay',
              param: ''
            }
          ],
          vibrate: 6
        })
      }
    })
  }
})
