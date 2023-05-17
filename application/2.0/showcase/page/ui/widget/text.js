import { createWidget, widget, event, align, text_style, prop } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'TEXT'
  },
  build() {
    try {
      const text = createWidget(widget.TEXT, {
        x: px(96),
        y: px(120),
        w: px(288),
        h: px(46),
        color: 0xffffff,
        text_size: px(36),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        text: 'HELLO ZEPPOS'
      })

      text.addEventListener(event.CLICK_DOWN, (info) => {
        text.setProperty(prop.MORE, {
          y: px(200)
        })
      })

      const textI18n = createWidget(widget.TEXT, {
        x: px(96),
        y: px(300),
        w: px(288),
        h: px(46),
        color: 0xffffff,
        text_size: px(36),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        text_i18n: {
          'zh-CN': '你好 Zepp OS',
          'en-US': 'HELLO ZEPPOS'
        }
      })
    } catch (e) {
      console.log('Build LifeCycle Error', e)
      e && e.stack && e.stack.split(/\n/).forEach((i) => console.log('error stack', i))
    }
  }
})
