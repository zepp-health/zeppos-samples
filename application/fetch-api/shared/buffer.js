import { getGlobal } from './global'

let globalNS = getGlobal()

if (!globalNS.Buffer) {
  if (typeof Buffer !== 'undefined') {
    globalNS.Buffer = Buffer
  } else {
    globalNS.Buffer = DeviceRuntimeCore.Buffer
  }
}
