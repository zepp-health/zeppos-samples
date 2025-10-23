import { getText } from "@zos/i18n";
import { keyboard, createWidget, widget } from "@zos/ui";

Page({
  build() {
    if (!keyboard.isEnabled()) {
      keyboard.gotoSettings();
      return;
    }

    const btn = createWidget(widget.BUTTON, {
      x: px(115),
      y: px(250),
      w: px(150),
      h: px(50),
      radius: 10,
      normal_color: 0xfc6950,
      press_color: 0xfeb4a8,
      text: "Keyboard Enabled",
    });

    console.log(getText("example"));
  },
});
