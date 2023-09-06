import hmUI from '@zos/ui'
import { Workout } from '@zos/sensor'
import { log } from '@zos/utils'
import { DEVICE_WIDTH } from '../libs/utils'

const BUTTON_X = 50;
const BUTTON_Y = 80;
const BUTTON_W = DEVICE_WIDTH - 2 * BUTTON_X;
const BUTTON_H = 50;

const logger = log.getLogger('workout.page')
const workout = new Workout();

let textWidget = null;
Page({
  onInit() {
    logger.log("page on init invoke");

    textWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: BUTTON_X + 20,
      y: BUTTON_Y,
      w: BUTTON_W,
      h: BUTTON_H * 6,
      text_style: hmUI.text_style.WRAP,
      align_h: hmUI.align.CENTER_H,
      align_v: hmUI.align.CENTER_V,
      text_size: 18,
      text: "workout Info",
      color: 0x34e073,
    });
    const status= workout.getStatus()
    console.log('-----', JSON.stringify(status))
    if (status) {
        const history = workout.getHistory()
        let show_text = '';
        show_text += `vo2max: ${status.vo2Max},trainingLoad: ${status.trainingLoad}, fullRecoveryTime:${status.fullRecoveryTime}\n`
        history.forEach((item, index) => {
            show_text += `startTime: ${item.startTime}, duration: ${item.duration}s\n`
        })
        textWidget.setProperty(hmUI.prop.TEXT, show_text);
    }
  },
  build() {
    logger.log("page build invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
