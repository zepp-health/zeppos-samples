import { getDeviceInfo } from "@zos/device";
import { log } from "@zos/utils";
import { replace } from "@zos/router";
import * as appService from "@zos/app-service";
import hmUI from "@zos/ui";

const { width: DEVICE_WIDTH } = getDeviceInfo();

let thisFile = "pages/bgService";
const serviceFile = "app-service/time_service";

// Start time report service
function startTimeService() {
  appService.start({
    url: serviceFile,
    param: `service=${serviceFile}&action=stop`,
    complete_func: (info) => {
      log.log(`startService result: ` + JSON.stringify(info));
      hmUI.showToast({ text: `start result: ${info.result}` });
      // refresh for button status
      replace({
        url: `${thisFile}`,
        params: `${thisFile}`,
      });
    },
  });
}

function stopTimeService() {
  log.log(`=== stop service: ${serviceFile} ===`);
  appService.stop({
    url: serviceFile,
    param: `service=${serviceFile}&action=stop`,
    complete_func: (info) => {
      log.log(`stopService result: ` + JSON.stringify(info));
      hmUI.showToast({ text: `stop result: ${info.result}` });
      // refresh for button status
      replace({
        url: `${thisFile}`,
        params: `${thisFile}`,
      });
    },
  });
}

Page({
  onInit() {
    log.log("page on init invoke");
  },
  build() {
    let services = appService.getAllAppServices();
    let running = services.includes(serviceFile);

    // Show tips
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80,
      w: DEVICE_WIDTH - 40 * 2,
      h: 80,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: "Time report service:\nsend a notification every minute!",
    });

    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80 + 80 + 20,
      w: DEVICE_WIDTH - 40 * 2,
      h: 120,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: running
        ? "Click button to stop service!"
        : "Click button to start service!",
    });

    hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 100,
      y: 280,
      w: DEVICE_WIDTH - 100 * 2,
      h: 50,
      radius: 8,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: running ? "Stop Service" : "Start Service",
      click_func: function (button) {
        if (running) stopTimeService();
        else startTimeService();
      },
    });
  },
  onPause() {
    log.log("page on pause invoke");
  },
  onResume() {
    log.log("page on resume invoke");
    replace({ url: `${thisFile}` });
  },
  onDestroy() {
    log.log("page on destroy invoke");
  },
});
