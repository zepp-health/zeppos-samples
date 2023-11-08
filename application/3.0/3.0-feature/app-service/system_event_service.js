import { log } from "@zos/utils";
const logger = log.getLogger("system_event_service");

AppService({
  onInit(e) {
    logger.log("service init");
    logger.log(e);
  },
  onDestroy() {
    logger.log("service on destroy invoke");
  },
});
