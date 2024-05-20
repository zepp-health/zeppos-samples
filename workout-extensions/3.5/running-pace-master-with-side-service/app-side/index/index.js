import { BaseSideService } from "@zeppos/zml/base-side";
const log = Logger.getLogger("app-side-service");

AppSideService(
  BaseSideService({
    onInit(e) {
      log.log("app-side-service onInit invoked", e);
    },

    onRun(e) {
      log.log("app-side-service onEvent invoked", e);
    },

    onDestroy() {
      log.log("app-side-service onDestroy invoked");
    },

    onRequest(req, res) {
      switch (req.method) {
        case 'your-method':
          res(null, {
            code: 0,
            message: 'success',
          })
      }
    }
  })
);
