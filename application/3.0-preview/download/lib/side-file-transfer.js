import { getFileTransfer } from './file-transfer'

const transferFileObj = (typeof transferFile !== 'undefined' && transferFile) ? transferFile : {}
export const fileTransferLib = getFileTransfer(transferFileObj)
