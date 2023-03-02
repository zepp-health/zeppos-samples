import { getGlobal } from './global'

let globalNS = getGlobal()

if (!globalNS.Logger && typeof DeviceRuntimeCore !== 'undefined') {
  globalNS.Logger = DeviceRuntimeCore.HmLogger
}
