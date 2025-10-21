import { getText } from "@zos/i18n";
import { keyboard, createWidget, widget } from "@zos/ui";

Page({
  build() {
    keyboard.isEnabled();

    const btn = createWidget(widget.BUTTON, {
      x: px(0),
      y: px(250),
      w: px(150),
      h: px(50),
      radius: 10,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: "go settings",
      click_func(e) {
        keyboard.gotoSettings();
      },
    });
    console.log(getText("example"));
  },
});
