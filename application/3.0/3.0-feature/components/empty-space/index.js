import * as hmUI from "@zos/ui";
import { EMPTY_SPACE } from "zosLoader:./index.[pf].layout.js";
import { DEVICE_HEIGHT } from "./../../libs/utils";

export function createEmptySpace(y, vc = hmUI) {
  if (y > DEVICE_HEIGHT / 3) {
    vc.createWidget(hmUI.widget.FILL_RECT, {
      ...EMPTY_SPACE,
      y,
    });
  }
}
