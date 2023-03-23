import { getTextLayout, createWidget, widget, deleteWidget, setAppWidgetSize, getAppWidgetSize } from "@zos/ui";
import { log as Logger } from "@zos/utils";
import { Calorie } from "@zos/sensor";
import { getText } from "@zos/i18n";

const logger = Logger.getLogger("calories");

import {
  CALORIE_TEXT,
  CALORIE_TEXT_SIZE,
  UNIT_TEXT,
  UNIT_TEXT_SIZE,
  CONSUME_ICON,
  CONSUME_ICON_WIDTH,
  IMGAE_CALORIES_MARIN,
  CALORIES_UNIT_MARIN,
  DEVICE_WIDTH,
  TOTAL_CONSUME_TEXT,
} from "../utils/styles-gts-3";

AppWidget({
  state: {
    refreshWidgetList: [],
  },

  onInit() {
    logger.log("===onInit===");
  },

  onDataRestore() {},

  build() {
    logger.log(getAppWidgetSize())

    setAppWidgetSize({
      h: 120
    })

    createWidget(widget.TEXT, TOTAL_CONSUME_TEXT);
  },

  onResume() {
    try {
      if (this.state.refreshWidgetList.length) {
        this.state.refreshWidgetList.forEach((i) => {
          deleteWidget(i);
        });
        this.state.refreshWidgetList = [];
      }
  
      this.getData();
      logger.log("===onResume===");
    } catch(e) {
      console.log('LifeCycle Error', e)
      e && e.stack && e.stack.split(/\n/).forEach((i) => console.log('error stack', i))
    }
  },

  getData() {
    const calories = new Calorie().getCurrent(); // Math.floor(Math.random() * 1000)

    this.buildTopContent(calories);
  },

  buildTopContent(calories) {
    const { width: w1 } = getTextLayout("" + calories, {
      text_size: CALORIE_TEXT_SIZE,
      text_width: 0,
      wrapped: 0,
    });
    const { width: w2 } = getTextLayout(getText("unit"), {
      text_size: UNIT_TEXT_SIZE,
      text_width: 0,
      wrapped: 0,
    });

    const w =
      w1 + w2 + CONSUME_ICON_WIDTH + IMGAE_CALORIES_MARIN + CALORIES_UNIT_MARIN;
    const x = Math.round((DEVICE_WIDTH - w) / 2);
    const baseY = 48;

    const textId = createWidget(widget.TEXT, {
      ...CALORIE_TEXT,
      text: `${calories}`,
      x: x + CONSUME_ICON_WIDTH + IMGAE_CALORIES_MARIN,
      w: w1,
      y: CALORIE_TEXT.y + baseY,
    });
    const unitId = createWidget(widget.TEXT, {
      ...UNIT_TEXT,
      x: x + w - w2,
      w: w2,
      y: UNIT_TEXT.y + baseY,
    });

    this.state.refreshWidgetList.push(textId, unitId);
    createWidget(widget.IMG, { ...CONSUME_ICON, x, y: CONSUME_ICON.y + baseY });
  },
});
