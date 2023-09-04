import { BaseSideService } from '../lib/base-side-service'
import { serviceModule } from './service'
import { Logger } from './logger'

const logger = Logger.getLogger('MP-SIDE')

AppSideService(BaseSideService({
  state: {},
  ...serviceModule,
  onInit() {
    logger.log('app side service invoke onInit')
  },
  onRun() {
    logger.log('app side service invoke onRun')
  },
  onDestroy() {
    logger.log('app side service invoke onDestroy')
  },
  onRequest(req, res) {
    this.service(req, res)
  },
  onSettingsChange(params) {
    this.settingsChange(params)
  }
}))
