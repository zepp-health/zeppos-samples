import "../shared/device-polyfill";
import { createDeviceMessage } from "./device-message";
import { fileTransferLib } from "./device-file-transfer";

export function BaseApp(initParams) {
  return {
    globalData: {},
    ...initParams,
    onCreate(...opts) {
      const device = createDeviceMessage();
      this.globalData.device = device;

      console.log("^^^^^^^^^^^^^^ddd");
      device
        .onCall(this.onCall?.bind(this))
        .onRequest(this.onRequest?.bind(this))
        .connect();

      fileTransferLib.onFile(this.onReceivedFile?.bind(this));

      initParams?.onCreate.apply(this, opts);
    },
    onDestroy(...opts) {
      console.log("^^^^^^^^sss^^^^^^ddd");
      const device = this.globalData.device;
      device.offOnCall().offOnRequest().disConnect();

      fileTransferLib.offFile();
      initParams?.onDestroy.apply(this, opts);
    },
    httpRequest(data) {
      const device = this.globalData.device;
      return device.request({
        method: "http.request",
        params: data,
      });
    },
  };
}
