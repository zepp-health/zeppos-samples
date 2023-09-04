import TransferFile from '@zos/ble/TransferFile'
import { getFileTransfer } from './file-transfer'

export const fileTransferLib = getFileTransfer(new TransferFile())