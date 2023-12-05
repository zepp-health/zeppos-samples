import { BaseSideService } from "@zeppos/zml/base/base-side";
import { messagingPlugin } from "@zeppos/zml/2.0/module/messaging/plugin/side";

BaseSideService.use(messagingPlugin);

AppSideService(
  BaseSideService({
    async onRequest(req, res) {
      const { type, params } = req;

      if (type === "UPLOAD") {
        console.log(params);

        settings.settingsStorage.setItem("sleepData", JSON.stringify(params));

        const result = await this.postData();

        res(null, result);
      } else if (type === "UPLOAD_DATA_SIDE_SERVICE") {
        console.log("params", params);
        settings.settingsStorage.setItem("sleepData", JSON.stringify(params));

        res(null, {
          code: 0,
          message: "SUCCESS",
        });
      }
    },
    onInit() {
      settings.settingsStorage.addListener(
        "change",
        async ({ key, newValue, oldValue }) => {
          if (key === "REQUEST_ACTION") {
            this.call({ type: "SETTINGS_APP_REQUEST_DATA" });
          } else if (key === "POST_ACTION") {
            this.postData();
          }
        }
      );
    },
    async postData() {
      console.log("service postData");

      const res = await fetch({
        url: "http://localhost:4080/sleep",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: settings.settingsStorage.getItem("sleepData"),
      });

      console.log(JSON.stringify(res.body));

      return res.body;
    },
  })
);
