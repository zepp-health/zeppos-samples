import { log } from "@zos/utils";
import * as router from "@zos/router";
import * as appServiceMgr from "@zos/app-service";
import { parseQuery } from "../libs/utils";

const moduleName = "app-event-1";

function handleEvent(e) {
  if (e.event === undefined) {
    return;
  }

  router.launchApp({
    appId: 0x000f4244,
    url: "pages/target",
    params: `app-event/index.js\n${e.event}`,
  });

  appServiceMgr.exit();
}

AppEvent({
  onEvent(e) {
    log.log(`${moduleName} onEvent(${e})`);
    const result = parseQuery(e);
    handleEvent(result);
  },
  onInit(e) {
    const result = parseQuery(e);
    handleEvent(result);
  },
  onDestroy() {
    log.log("app-event on destroy invoke");
  },
});
