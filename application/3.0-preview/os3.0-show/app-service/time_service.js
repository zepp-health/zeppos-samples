import { parseQuery } from '../libs/utils'
import { log } from '@zos/utils'
import * as notificationMgr from '@zos/notification'
import * as appServiceMgr from '@zos/app-service'
import { Time } from '@zos/sensor'

var moduleName = "Time Service";
var timeSensor = new Time();

// Send a notification
function sendNotification() {
  notificationMgr.notify({
    title: "Time Service",
    content: `Now the time is ${timeSensor.hour}:${timeSensor.minute}:${timeSensor.second}`,
    actions: [
      {
        text: "Home Page",
        file: "pages/index",
      },
      {
        text: "Stop Service",
        file: "app-service/time_service",
        param: "action=exit", //! processed in onEvent()
      },
    ],
  });
}

AppService({
  onEvent(e) {
    log.log(`service onEvent(${e})`);
    let result = parseQuery(e);
    if (result.action === "exit") {
      appServiceMgr.exit();
    }
  },
  onInit(e) {
    log.log(`service onInit(${e})`);

    timeSensor.onPerMinute(function () {
      log.log(
        `${moduleName} time report: ${timeSensor.getHours()}:${timeSensor.getMinutes()}:${timeSensor.getSeconds()}`
      );
      sendNotification();
    });

    timeSensor.onPerDay(function () {
      log.log(moduleName + " === day change ===");
    });
  },
  onDestroy() {
    log.log("page on destroy invoke");
  },
});
