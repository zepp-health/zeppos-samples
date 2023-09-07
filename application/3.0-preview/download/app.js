import { BaseApp } from "./lib/base-app";
import { EventBus } from "@zos/utils";

const bus = new EventBus();

App(
  BaseApp({
    globalData: {
      bus,
    },
    onCreate() {
      console.log("app on create invoke");
    },

    onDestroy() {
      console.log("app on destroy invoke");
    },
  })
);
