import { createWidget, widget, prop } from "@zos/ui";
import { Time } from "@zos/sensor";
import {
  timeStyle,
  batteryStyle,
  sportTimeStyle,
  sportDistanceStyle,
  sportPaceStyle,
  heartStyle,
} from "zosLoader:./index.[pf].layout.js";

const time = new Time();

DataWidget({
  state: {
    intervalId: null
  },
  init() {
    const bg = createWidget(widget.IMG, {
      x: 0,
      y: 0,
      src: "bg.png",
    });

    const timeText = createWidget(widget.TEXT, timeStyle);

    function setTime() {
      const hourVal = time.getHours();
      const minuteVal = time.getMinutes();
      const secondVal = time.getSeconds();

      const hour = hourVal < 10 ? `0${hourVal}` : hourVal;
      const minute = minuteVal < 10 ? `0${minuteVal}` : minuteVal;
      const second = secondVal < 10 ? `0${secondVal}` : secondVal;

      timeText.setProperty(prop.MORE, {
        text: hour + ":" + minute + ":" + second,
      });
    }

    setTime()
    this.state.intervalId = setInterval(setTime, 1000)

    createWidget(widget.IMG_LEVEL, batteryStyle);
    createWidget(widget.SPORT_DATA, sportTimeStyle);
    createWidget(widget.SPORT_DATA, sportDistanceStyle);
    createWidget(widget.SPORT_DATA, sportPaceStyle);
    createWidget(widget.SPORT_DATA, heartStyle);
  },

  build() {
    this.init();
  },
  onInit() {},

  onDestroy() {
    this.intervalId && clearInterval(this.state.intervalId)
  },
});
