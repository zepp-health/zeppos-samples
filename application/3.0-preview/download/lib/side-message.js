import { MessageBuilder } from "../shared/message";
import { wrapperMessage } from "./message";

const logger = Logger.getLogger("MP-SM");
const messageBuilder = new (MessageBuilder(logger, false, undefined))();
export const device = wrapperMessage(messageBuilder, logger, false);
