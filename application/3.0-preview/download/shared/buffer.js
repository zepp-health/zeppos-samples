import { getGlobal } from './global'

const globalNS = getGlobal()

if (!globalNS.Buffer) {
  if (typeof Buffer === 'undefined') {
    // zeppos 1.0
    if (typeof DeviceRuntimeCore !== 'undefined') {
      globalNS.Buffer = DeviceRuntimeCore.Buffer
    }
  }
}
