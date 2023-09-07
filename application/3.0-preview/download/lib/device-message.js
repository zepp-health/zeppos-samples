import { log as Logger } from "@zos/utils";
import { getPackageInfo } from "@zos/app";
import nativeBle from "@zos/ble";
import { MessageBuilder } from "../shared/message";
import { wrapperMessage } from "./message";

const appDevicePort = 20;
const appSidePort = 0;
const logger = Logger.getLogger("MP-DM");

export function createDeviceMessage() {
  const messageBuilder = new (MessageBuilder(logger, true, nativeBle))({
    appId: getPackageInfo().appId,
    appDevicePort,
    appSidePort,
  });

  return wrapperMessage(messageBuilder, logger, true);
}

export function getDeviceMessage() {
  const { device } = getApp()._options.globalData;
  return device;
}
