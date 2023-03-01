import { parseQuery } from '../libs/utils'
import { log } from '@zos/utils'
import * as notificationMgr from '@zos/notification'
import * as appServiceMgr from '@zos/app-service'
import { Time } from '@zos/sensor'

const moduleName = "Time Service";
const timeSensor = new Time();

const logger = log.getLogger('time.service')

// Send a notification
function sendNotification() {
  logger.log('send notification')
  notificationMgr.notify({
    title: "Time Service",
    content: `Now the time is ${timeSensor.getHours()}:${timeSensor.getMinutes()}:${timeSensor.getSeconds()}`,
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
    logger.log(`service onEvent(${e})`);
    let result = parseQuery(e);
    if (result.action === "exit") {
      appServiceMgr.exit();
    }
  },
  onInit(e) {
    logger.log(`service onInit(${e})`);

    timeSensor.onPerMinute(() => {
      logger.log(
        `${moduleName} time report: ${timeSensor.getHours()}:${timeSensor.getMinutes()}:${timeSensor.getSeconds()}`
      );
      sendNotification();
    });

    timeSensor.onPerDay(() => {
      logger.log(moduleName + " === day change ===");
    });
  },
  onDestroy() {
    logger.log("service on destroy invoke");
  },
});
