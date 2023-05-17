Page({
  build() {
    let page_cnt = 10
    let vertical = false
    let page_size = px(480)
    hmUI.setScrollView(true, page_size, page_cnt, vertical)
    pg_indicator = hmUI.createWidget(hmUI.widget.PAGE_INDICATOR, {
      x: 0,
      y: px(50),
      w: px(480),
      h: px(100),
      align_h: hmUI.align.CENTER_H,
      h_space: 8,
      select_src: 'select.png',
      unselect_src: 'unselect.png'
    })
    for (let i = 0; i < page_cnt; i++) {
      let x_pos = vertical ? 0 : page_size * i
      let y_pos = vertical ? px(400) + page_size * i : px(400)
      hmUI.createWidget(hmUI.widget.TEXT, {
        x: px(x_pos),
        y: px(y_pos),
        w: px(480),
        h: px(120),
        text_size: 35,
        color: 0xffffff,
        align_h: hmUI.align.CENTER_H,
        text: 'PAGE ' + i.toString()
      })
    }
  }
})
