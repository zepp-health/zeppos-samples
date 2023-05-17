import { createWidget, widget, align, prop } from '@zos/ui'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'DIALOG'
  },
  build() {
    const dialog = createWidget(widget.DIALOG, {
      ok_text: 'OK',
      cancel_text: 'CANCEL'
    })
    dialog.setProperty(prop.MORE, {
      text: 'DIALOG TITLE',
      content_text_size: 40,
      content_bg_color: 0x000000,
      content_text_color: 0xffffff,
      dialog_align_h: align.CENTER_H,
      content_text_align_h: align.CENTER_H,
      content_text_align_v: align.CENTER_V,
      ok_func: () => {
        console.log('DIALOG OK')
      },
      cancel_func: () => {
        console.log('DIALOG CANCEL')
      }
    })
    dialog.setProperty(prop.SHOW, true)
  }
})
