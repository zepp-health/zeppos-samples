import { Logger } from './logger'
import { stringify } from '../shared/url'
const logger = Logger.getLogger('music player side-service fetch')

export async function request(opts, vm = this) {
  const { method = 'GET', url = '', body = '', headers = null } = opts
  try {
    const params = {
      url,
      method
    }

    if (headers && headers !== null) params['headers'] = headers

    if (method !== 'GET' && method !== 'HEAD') {
      if (params.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        params.body = body ? stringify(body) : ''
      } else {
        params.body = body ? JSON.stringify(body) : ''
      }
    }

    logger.log(`request---------> method: ${method}, path: ${url}, params: ${JSON.stringify(params)}`)
    const response = await vm.fetch(params)
    let data = {}
    try {
      data = await response.json()
      logger.log('response ==============> %j', data)
    } catch (err) {
      data = response.body && typeof response.body === 'string' ? JSON.parse(response.body) : response.body
      logger.log(`request---------> method: ${method}, path: ${url}, data: ${response.body}`)
    }

    return data
  } catch (error) {
    logger.log(`request---------> method: ${method}, path: ${url}, error: `, error)
  }
}
