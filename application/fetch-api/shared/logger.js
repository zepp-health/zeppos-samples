import { getGlobal } from './global'

let globalNS = getGlobal()

if (!globalNS.Logger) {
  if (typeof DeviceRuntimeCore !== 'undefined') {
    globalNS.Logger = DeviceRuntimeCore.HmLogger
  } else {
    if (typeof Logger !== 'undefined') {

    }
    // console.connect = () => {
    //   // pass
    // }
    // globalNS.Logger = {
    //   getLogger() {
    //     return console
    //   },
    // }
  }
}
