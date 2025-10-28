import { px } from "@zos/utils";
import { getDeviceInfo } from "@zos/device";
import {
  createWidget,
  widget,
  align,
  prop,
  text_style,
  event,
  keyboard,
} from "@zos/ui";

const { width: device_width, height: device_height } = getDeviceInfo();
const { h } = keyboard.getContentRect();

export const styles = {
  container: {
    layout: {
      display: "flex",
      flex_flow: "column wrap",
      justify_content: "start",
      align_items: "center",
      align_content: "center",
      top: h + "",
      width: "100vw",
      height: "100vh",
    },
  },
  candidateBar: {
    layout: {
      display: "flex",
      justify_content: "center",
      flex_flow: "row",
      column_gap: "5",
      width: "100%",
      height: "10vh",
    },
  },
  candidateButton: {
    radius: 10,
    normal_color: 0xfc6950,
    press_color: 0xfeb4a8,
    layout: {
      width: "50",
      height: "100%",
      font_size: "40",
    },
  },
  keyboard: {
    layout: {
      display: "flex",
      flex_flow: "column",
      gap: "2",
      width: "100%",
      flex_grow: "1",
    },
  },
  keyboardRow: {
    layout: {
      display: "flex",
      flex_flow: "row wrap",
      justify_content: "center",
      align_items: "center",
      align_content: "center",
      width: "100%",
      height: "12vh",
      column_gap: "2",
    },
  },
  keyButton: {
    radius: 10,
    normal_color: 0xfc6950,
    press_color: 0xfeb4a8,
    layout: {
      height: "100%",
      width: "43",
      font_size: "50",
    },
  },
  toggleLang: {
    text: "切换语言",
    normal_color: 0xfc6950,
    press_color: 0xfeb4a8,
    radius: 10,
    layout: {
      width: "100",
      height: "100%",
      font_size: "40",
      min_width: "50",
    },
  },
};
