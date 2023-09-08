import { BaseSideService } from '@zeppos/zml/base-side'

const logger = Logger.getLogger('test')

AppSideService(
  BaseSideService({
    onInit() {
      logger.log('app side service invoke onInit')
    },
    onRun() {
      logger.log('app side service invoke onRun')
    },
    onDestroy() {
      logger.log('app side service invoke onDestroy')
    },
    getDataFromDevice() {
      return this.request({
        method: 'your.method2',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
        .then((result) => {
          // receive your data
          logger.log('result=>', result)
        })
        .catch((error) => {
          // receive your error
          logger.error('error=>', error)
        })
    },
    notifyDevice() {
      this.call({
        method: 'your.method4',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
    },
    onRequest(req, res) {
      // request from device
      // need reply
      // node style callback
      // first param is error
      // second param is your data
      if (req.method === 'your.method1') {
        // do something
        logger.debug('receive request=>', req)
        res(null, {
          test: 'test',
        })
      } else {
        res('error happened')
      }
    },

    onCall(req) {
      // call from device
      // no reply
      logger.debug('receive call=>', req)
      if (req.method === 'your.method3') {
        // do something
        logger.debug('receive call=>', req)
      } else if (req.method === 'mobile.request') {
        this.getDataFromDevice()
      } else if (req.method === 'mobile.call') {
        this.notifyDevice()
      }
    },
  }),
)
