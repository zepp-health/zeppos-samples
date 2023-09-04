import { log as Logger } from '@zos/utils'
import { getPackageInfo } from '@zos/app'
import * as alarmMgr from '@zos/alarm'
const logger = Logger.getLogger('index-service')

AppService({
    onInit(params) {
        logger.log('delay onInit=', params)
        this.delayAlarm(params)
    },
    onEvent(params) {
        logger.log('delay onEvent=', params)
    },
    delayAlarm() {
        const { appId } = getPackageInfo()
        const date = new Date()
        date.setMinutes(date.getMinutes() + 1)
        const alarm = {
            appid: appId,
            file: 'app-service/index',
            date: Math.round(date.getTime() / 1000),
            param: '',
            repeat_type: alarmMgr.ONCE,
            store: true
        }
        alarmMgr.set(alarm)
    }
})