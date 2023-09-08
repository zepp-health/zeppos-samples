import { settingsLib } from '@zeppos/zml/base-side'
const logger = Logger.getLogger('test-settings')

export const settingsModule = {
  async onRunSettingsChange() {
    this.testSettings()
    logger.log('settings run')
  },
  testSettings() {
    logger.log('settings all value %j', settingsLib.getAll())
  },
}
