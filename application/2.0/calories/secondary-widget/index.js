import { getTextLayout, createWidget, widget, deleteWidget } from "@zos/ui";
import { push } from "@zos/router";
import { getText } from "@zos/i18n";
import { Calorie } from "@zos/sensor";
import { log as Logger, px } from "@zos/utils";

import {
  CALORIE_TEXT,
  CALORIE_TEXT_SIZE,
  UNIT_TEXT,
  UNIT_TEXT_SIZE,
  TOTAL_CONSUME_TEXT,
  CONSUME_ICON,
  CONSUME_ICON_WIDTH,
  IMGAE_CALORIES_MARIN,
  CALORIES_UNIT_MARIN,
  EQUIVALENT_TO_BUTTON,
  EQUIVALENT_TO_FOOD_ICON,
  DEVICE_WIDTH,
  EQUIVALENT_MORE_X,
  EQUIVALENT_MARGIN,
  EQUIVALENT_TO_FOOD_ICON_WIDTH,
  EQUIVALENT_MORE_FOOD_ICON,
  EQUIVALENT_MORE_FOOD_NUM,
} from "../utils/styles-gts-3";
import { FOOD_CALORIES } from "../utils/constants";
const logger = Logger.getLogger("calories");
const globalData = getApp()._options.globalData;

SecondaryWidget({
  state: {
    refreshWidgetList: [],
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
    const baseY = 64;

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
  build() {
    logger.log("===build===");
    createWidget(widget.TEXT, TOTAL_CONSUME_TEXT);

    createWidget(widget.BUTTON, {
      ...EQUIVALENT_TO_BUTTON,
      click_func: () => {
        push({
          url: "page/gts/food-list",
        });
      },
    });
  },
  calculate(currentCalories, foodData) {
    let { value, type } = foodData;
    let count = Math.floor(currentCalories / value);
    if (count === 1 || count === 2 || count === 3) {
      let x =
        (DEVICE_WIDTH -
          EQUIVALENT_TO_FOOD_ICON_WIDTH * count -
          EQUIVALENT_MARGIN * (count - 1)) /
        2;
      for (let index = 0; index < count; index++) {
        this.drawFood(
          x + (EQUIVALENT_MARGIN + EQUIVALENT_TO_FOOD_ICON_WIDTH) * index,
          type
        );
      }
    } else {
      this.drawFood(EQUIVALENT_MORE_X, type); // icon
      const imgId = createWidget(widget.IMG, EQUIVALENT_MORE_FOOD_ICON);
      const textId = createWidget(widget.TEXT, {
        ...EQUIVALENT_MORE_FOOD_NUM,
        text: `${count}`,
      });

      this.state.refreshWidgetList.push(imgId, textId);
    }
  },
  drawFood(x, type) {
    const imgWidget = createWidget(widget.IMG, {
      ...EQUIVALENT_TO_FOOD_ICON,
      x: px(x),
      src: `food/${type}.png`,
    });

    this.state.refreshWidgetList.push(imgWidget);
  },
  onResume() {
    if (this.state.refreshWidgetList.length) {
      this.state.refreshWidgetList.forEach((i) => {
        deleteWidget(i);
      });
      this.state.refreshWidgetList = [];
    }

    this.getData();
    logger.log("===onResume===");
  },

  getData() {
    const calories = new Calorie().getCurrent(); // Math.floor(Math.random() * 1000)
    const currentFood = globalData.foodType;

    this.buildTopContent(calories);

    const activeIndex = FOOD_CALORIES.findIndex(
      (item) => item.type === currentFood
    );
    this.calculate(calories, FOOD_CALORIES[activeIndex]);
  },
});
