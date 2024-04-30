import { createWidget, widget, align, text_style, sport_data, edit_widget_group_type } from '@zos/ui'

DataWidget({
  init() {
    const bg = createWidget(widget.IMG, {
      x: 0,
      y: 0,
      src: 'bg.png'
    })
    const text = createWidget(widget.TEXT, {
      x: 240,
      y: 82,
      w: 150,
      h: 85,
      color: 0xffffff,
      text_size: 30,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: 'BPM'
    })

    // Calorie
    const widgetOptionalArray1 = [sport_data.CONSUME]
    createWidget(widget.SPORT_DATA, {
      edit_id: 1,
      x: 60,
      y: 310,
      w: 104,
      h: 120,
      category: edit_widget_group_type.SPORTS,
      default_type: sport_data.CONSUME,
      optional_types: widgetOptionalArray1,
      count: widgetOptionalArray1.length,
      rect_visible: false,
      line_color: 0x000000,
      text_size: 50,
      text_color: 0xffffff,
      text_x: 0,
      text_y: 0,
      text_w: 170,
      text_h: 85,
      sub_text_visible: true,
      sub_text_size: 24,
      sub_text_color: 0x999999,
      sub_text_x: 35,
      sub_text_y: 80,
      sub_text_w: 100,
      sub_text_h: 30
    })

    // Distance
    const widgetOptionalArray2 = [sport_data.DISTANCE_TOTAL]
    createWidget(widget.SPORT_DATA, {
      edit_id: 2,
      x: 195,
      y: 310,
      w: 104,
      h: 120,
      category: edit_widget_group_type.SPORTS,
      default_type: sport_data.DISTANCE_TOTAL,
      optional_types: widgetOptionalArray2,
      count: widgetOptionalArray2.length,
      line_color: 0x000000,
      text_size: 50,
      rect_visible: false,
      text_color: 0xffffff,
      text_x: 0,
      text_y: 0,
      text_w: 210,
      text_h: 85,
      sub_text_visible: true,
      sub_text_size: 24,
      sub_text_color: 0x999999,
      sub_text_x: 60,
      sub_text_y: 80,
      sub_text_w: 100,
      sub_text_h: 30
    })

    // Pace
    const widgetOptionalArray3 = [sport_data.PACE]
    createWidget(widget.SPORT_DATA, {
      edit_id: 3,
      x: -5,
      y: 170,
      w: 168,
      h: 135,
      category: edit_widget_group_type.SPORTS,
      default_type: sport_data.PACE,
      optional_types: widgetOptionalArray3,
      count: widgetOptionalArray3.length,
      line_width: 0,
      rect_visible: false,
      line_color: 0xc1e002,
      text_size: 90,
      text_color: 0x000000,
      text_x: 0,
      text_y: 0,
      text_w: 300,
      text_h: 100,
      sub_text_visible: true,
      sub_text_size: 40,
      sub_text_color: 0xffffff,
      sub_text_x: 330,
      sub_text_y: 15,
      sub_text_w: 100,
      sub_text_h: 100
    })

    // Heartrate
    const widgetOptionalArray = [sport_data.HR]
    createWidget(widget.SPORT_DATA, {
      edit_id: 4,
      x: 160,
      y: 82,
      w: 89,
      h: 84,
      category: edit_widget_group_type.SPORTS,
      default_type: sport_data.HR,
      optional_types: widgetOptionalArray,
      count: widgetOptionalArray.length,
      rect_visible: false,
      line_color: 0x000000,
      text_size: 50,
      text_color: 0xffffff,
      text_x: 0,
      text_y: 0,
      text_w: 130,
      text_h: 85,
      sub_text_visible: false
    })
  },

  build() {
    this.init()
  },
  onInit() {},

  onDestroy() {}
})
