import { px } from "@zos/utils";
import {
  align,
  text_style,
  data_type,
  edit_widget_group_type,
  sport_data,
} from "@zos/ui";

const batteryArr = Array.from({ length: 10 }).map(
  (_, i) => `battery/${i + 1}.png`
);

export const bgStyle = {
  x: 0,
  y: 0,
  src: "bg.png",
};

export const timeStyle = {
  x: 0,
  y: px(40),
  w: px(480),
  h: px(94),
  color: 0x000000,
  text_size: px(82),
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: text_style.NONE,
  text: "",
};

export const batteryStyle = {
  x: px(224),
  y: px(10),
  image_array: batteryArr,
  image_length: batteryArr.length, //长度
  type: data_type.BATTERY,
};

export const sportTimeStyle = {
  edit_id: 1,
  x: px(50),
  y: px(138),
  w: px(222),
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.DURATION_NET,
  line_color: 0x000000,
  text_size: px(86),
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(0),
  text_w: px(180),
  text_h: px(85),
  sub_text_visible: true,
  sub_text_size: px(24),
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: px(180),
  sub_text_h: px(30),
};

export const sportDistanceStyle = {
  edit_id: 2,
  x: px(480 / 2),
  y: px(138),
  w: px(180),
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.DISTANCE_TOTAL,
  line_color: 0x000000,
  text_size: px(86),
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(0),
  text_w: px(180),
  text_h: px(85),
  sub_text_visible: true,
  sub_text_size: px(24),
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: px(180),
};

export const sportPaceStyle = {
  edit_id: 3,
  x: px(50),
  y: px(283),
  w: px(180),
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.PACE,
  line_color: 0x000000,
  text_size: px(86),
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(0),
  text_w: px(180),
  text_h: px(85),
  sub_text_visible: true,
  sub_text_size: px(24),
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: px(180),
  sub_text_h: px(30),
};

export const heartStyle = {
  edit_id: 4,
  x: px(480 / 2),
  y: px(283),
  w: px(170),
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.HR,
  line_color: 0x000000,
  text_size: px(86),
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(0),
  text_w: px(170),
  text_h: px(85),
  sub_text_visible: true,
  sub_text_size: px(24),
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: px(170),
  sub_text_h: px(30),
};
