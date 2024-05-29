import {
  createWidget,
  widget,
  align,
  text_style,
  sport_data,
  edit_widget_group_type,
} from "@zos/ui";
import { px } from '@zos/utils'
import { BasePage } from "@zeppos/zml/base-page";

DataWidget(
  BasePage({
    init() {
      const bg = createWidget(widget.IMG, {
        x: 0,
        y: 0,
        src: "bg.png",
      });
      const text = createWidget(widget.TEXT, {
        x: px(240),
        y: px(82),
        w: px(150),
        h: px(85),
        color: 0xffffff,
        text_size: px(30),
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        text: "BPM",
      });

      // Calorie
      createWidget(widget.SPORT_DATA, {
        edit_id: 1,
        x: px(60),
        y: px(310),
        w: px(104),
        h: px(120),
        category: edit_widget_group_type.SPORTS,
        default_type: sport_data.CONSUME,
        
        line_color: 0x000000,
        text_size: px(50),
        text_color: 0xffffff,
        text_x: 0,
        text_y: 0,
        text_w: px(170),
        text_h: px(85),
        sub_text_visible: true,
        sub_text_size: px(24),
        sub_text_color: 0x999999,
        sub_text_x: px(35),
        sub_text_y: px(80),
        sub_text_w: px(100),
        sub_text_h: px(30),
      });

      // Distance
      createWidget(widget.SPORT_DATA, {
        edit_id: 2,
        x: px(195),
        y: px(310),
        w: px(104),
        h: px(120),
        category: edit_widget_group_type.SPORTS,
        default_type: sport_data.DISTANCE_TOTAL,
        line_color: 0x000000,
        text_size: px(50),
        
        text_color: 0xffffff,
        text_x: 0,
        text_y: 0,
        text_w: px(210),
        text_h: px(85),
        sub_text_visible: true,
        sub_text_size: px(24),
        sub_text_color: 0x999999,
        sub_text_x: px(60),
        sub_text_y: px(80),
        sub_text_w: px(100),
        sub_text_h: px(30),
      });

      // Pace
      createWidget(widget.SPORT_DATA, {
        edit_id: 3,
        x: px(-5),
        y: px(170),
        w: px(168),
        h: px(135),
        category: edit_widget_group_type.SPORTS,
        default_type: sport_data.PACE,
        line_width: 0,
        
        line_color: 0xc1e002,
        text_size: px(90),
        text_color: 0x000000,
        text_x: 0,
        text_y: 0,
        text_w: px(300),
        text_h: px(100),
        sub_text_visible: true,
        sub_text_size: px(40),
        sub_text_color: 0xffffff,
        sub_text_x: px(330),
        sub_text_y: px(15),
        sub_text_w: px(100),
        sub_text_h: px(100),
      });

      // Heartrate
      createWidget(widget.SPORT_DATA, {
        edit_id: 4,
        x: px(160),
        y: px(82),
        w: px(89),
        h: px(84),
        category: edit_widget_group_type.SPORTS,
        default_type: sport_data.HR,
        
        line_color: 0x000000,
        text_size: px(50),
        text_color: 0xffffff,
        text_x: 0,
        text_y: 0,
        text_w: px(130),
        text_h: px(85),
        sub_text_visible: false,
      });
    },

    build() {
      this.init();
    },
    onInit() {
      this.request({
        method: "your-method",
        params: {
          name: "foo",
        },
      }).then((data) => {
        this.log("result=>", data);
      });
    },

    onDestroy() {},
  })
);
