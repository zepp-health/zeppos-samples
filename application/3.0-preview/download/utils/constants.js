import { getDeviceInfo } from '@zos/device'
// 设备信息
export const DEVICE_INFO = getDeviceInfo()

// 设备形状
export const DEVICE_SHAPE = DEVICE_INFO.screenShape === 0 ? 'square' : 'round'

// 设备宽高
export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = DEVICE_INFO