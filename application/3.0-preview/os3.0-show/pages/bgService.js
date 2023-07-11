import { getDeviceInfo } from "@zos/device";
import { log } from "@zos/utils";
import { replace } from "@zos/router";
import * as appService from "@zos/app-service";
import hmUI from "@zos/ui";
import { DEVICE_WIDTH } from "../libs/utils";
import { queryPermission, requestPermission } from '@zos/app'

function setProperty(w, p, v) {
  w.setProperty(p, v);
}

let thisFile = "pages/bgService";
const serviceFile = "app-service/time_service";

const txtResource = {
  label: {
    'true': 'Click button to stop service!',
    'false': 'Click button to start service!'
  },
  btn: {
    'true': 'Stop Service',
    'false': 'start Service'
  }
}
const logger = log.getLogger('bgService.page')
// Start time report service
const permissions = ['device:os.bg_service']

function permissionRequest(vm) {
  const [result2] = queryPermission({
    permissions
  })

  if (result2 === 0) {
    requestPermission({
      permissions,
      callback([result2]) {
        if (result2 === 2) {
          startTimeService(vm)
        }
      }
    })
  } else if (result2 === 2) {
    startTimeService(vm)
  }
}
function startTimeService(vm) {
  logger.log(`=== start service: ${serviceFile} ===`);
  const result = appService.start({
    url: serviceFile,
    param: `service=${serviceFile}&action=start`,
    complete_func: (info) => {
      logger.log(`startService result: ` + JSON.stringify(info));
      hmUI.showToast({ text: `start result: ${info.result}` });
      // refresh for button status

      if (info.result) {
        vm.state.running = true;
        setProperty(
          vm.state.txtLabel,
          hmUI.prop.TEXT,
          txtResource.label[vm.state.running]
        );
        setProperty(vm.state.serviceBtn, hmUI.prop.TEXT, txtResource.btn[vm.state.running]);
      }
    },
  });

  if (result) {
    logger.log('startService result: ', result)
  }
}

function stopTimeService(vm) {
  logger.log(`=== stop service: ${serviceFile} ===`);
  appService.stop({
    url: serviceFile,
    param: `service=${serviceFile}&action=stop`,
    complete_func: (info) => {
      logger.log(`stopService result: ` + JSON.stringify(info));
      hmUI.showToast({ text: `stop result: ${info.result}` });
      // refresh for button status

      if (info.result) {
        vm.state.running = false;
        setProperty(
          vm.state.txtLabel,
          hmUI.prop.TEXT,
          txtResource.label[vm.state.running]
        );
        setProperty(vm.state.serviceBtn, hmUI.prop.TEXT, txtResource.btn[vm.state.running]);
      }
    },
  });
}

Page({
  state: {
    running: false,
    txtLabel: null,
    serviceBtn: null,
  },
  onInit() {
    logger.log("page on init invoke");
  },
  build() {
    const vm = this;
    let services = appService.getAllAppServices();
    vm.state.running = services.includes(serviceFile);

    logger.log('service status %s', vm.state.running)

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

    vm.state.txtLabel = hmUI.createWidget(hmUI.widget.TEXT, {
      x: 40,
      y: 80 + 80 + 20,
      w: DEVICE_WIDTH - 40 * 2,
      h: 120,
      text_size: 24,
      align_h: hmUI.align.CENTER_H,
      color: 0xffffff,
      text: txtResource.label[vm.state.running],
    });

    vm.state.serviceBtn = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 100,
      y: 280,
      w: DEVICE_WIDTH - 100 * 2,
      h: 50,
      radius: 8,
      press_color: 0x1976d2,
      normal_color: 0xef5350,
      text: txtResource.btn[vm.state.running],
      click_func: function () {
        if (vm.state.running) stopTimeService(vm);
        else permissionRequest(vm);
      },
    });
  },
  onPause() {
    logger.log("page on pause invoke");
  },
  onResume() {
    logger.log("page on resume invoke");
    replace({ url: `${thisFile}` });
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});
