import { createWidget, widget, prop, event } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'PICK_DATE'
  },
  build() {
    const pick_date_date = createWidget(widget.PICK_DATE)
    pick_date_date.setProperty(prop.MORE, {
      w: px(480),
      x: px(20),
      y: px(120),
      startYear: 2000,
      endYear: 2030,
      initYear: 2021,
      initMonth: 2,
      initDay: 3
    })

    const confirm = createWidget(widget.TEXT, {
      x: 0,
      y: 400,
      w: 480,
      h: 80,
      text_size: 42,
      color: 0xffffff,
      text: 'confirm'
    })

    confirm.addEventListener(event.CLICK_UP, (info) => {
      const dateObj = pick_date_date.getProperty(prop.MORE, {})
      const { year, month, day } = dateObj

      this.state.logger.log('year', year)
      this.state.logger.log('month', month)
      this.state.logger.log('day', day)
    })
  }
})
