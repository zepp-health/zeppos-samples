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
  w: 390,
  h: 450,
  auto_scale: true,
  auto_scale_obj_fit: true,
  src: "bg.png",
};

export const timeStyle = {
  x: 0,
  y: 46,
  w: 390,
  h: 99,
  color: 0x000000,
  text_size: 108,
  align_h: align.CENTER_H,
  align_v: align.CENTER_V,
  text_style: text_style.NONE,
  text: "",
};

export const batteryStyle = {
  x: px(224),
  y: 18,
  image_array: batteryArr,
  image_length: batteryArr.length,
  type: data_type.BATTERY,
};

export const sportTimeStyle = {
  edit_id: 1,
  x: 3,
  y: 157,
  w: 186,
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.DURATION_NET,
  line_color: 0x000000,
  text_size: 72,
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(10),
  text_w: 186,
  text_h: 76,
  sub_text_visible: true,
  sub_text_size: 24,
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: 186,
  sub_text_h: px(30),
};

export const sportDistanceStyle = {
  edit_id: 2,
  x: 198,
  y: 157,
  w: 186,
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.DISTANCE_TOTAL,
  line_color: 0x000000,
  text_size: 72,
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(10),
  text_w: 186,
  text_h: 76,
  sub_text_visible: true,
  sub_text_size: px(24),
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: 186,
  sub_text_h: px(30),
};

export const sportPaceStyle = {
  edit_id: 3,
  x: 4,
  y: 281,
  w: 186,
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.PACE,
  line_color: 0x000000,
  text_size: 72,
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(10),
  text_w: 186,
  text_h: 76,
  sub_text_visible: true,
  sub_text_size: 24,
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: 186,
  sub_text_h: px(30),
};

export const heartStyle = {
  edit_id: 4,
  x: 198,
  y: 281,
  w: 190,
  h: px(128),
  category: edit_widget_group_type.SPORTS,
  default_type: sport_data.HR,
  line_color: 0x000000,
  text_size: 72,
  text_color: 0xffffff,
  text_x: 0,
  text_y: px(10),
  text_w: 190,
  text_h: 76,
  sub_text_visible: true,
  sub_text_size: 24,
  sub_text_color: 0x999999,
  sub_text_x: 0,
  sub_text_y: px(85),
  sub_text_w: 190,
  sub_text_h: px(30),
};
