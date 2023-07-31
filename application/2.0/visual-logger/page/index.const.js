import { getDeviceInfo } from "@zos/device";
export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();

export const SCREEN_CENTER_X = DEVICE_WIDTH / 2;
export const SCREEN_CENTER_Y = DEVICE_HEIGHT / 2;

export const SW_WIDTH = 96;
export const SW_HEIGHT = 64;
export const SW_POS_X = SCREEN_CENTER_X - SW_WIDTH / 2;
export const SW_POS_Y = SCREEN_CENTER_Y - SW_HEIGHT / 2;
export const PADDING = 24;

export const BTN_WIDTH = SW_HEIGHT;
export const BTN_HEIGHT = SW_HEIGHT;
export const BTN_POS_Y = SCREEN_CENTER_Y - BTN_HEIGHT / 2;
export const BTN_R_POS_X = DEVICE_WIDTH - PADDING - BTN_WIDTH;
export const BTN_L_POS_X = 0 + PADDING;

export const BTN_NUM_POS_X = SCREEN_CENTER_X - BTN_WIDTH / 2;

export const COLOR_WHITE = 0xffffff;
export const COLOR_ORANGE_NORM = 0xfc6950;
export const COLOR_ORANGE_PRESS = 0xfeb4a8;
export const COLOR_RED_NORM = 0xff6347;
export const COLOR_RED_PRESS = 0xbb6347;
export const COLOR_GREEN_NORM = 0x3cb371;
export const COLOR_GREEN_PRESS = 0x2ca371;
export const COLOR_BLUE_NORM = 0x0884d0;
export const COLOR_BLUE_PRESS = 0x5554d0;
export const LINE_COLOR = 0x333333;
export const TEXT_SIZE = 24;