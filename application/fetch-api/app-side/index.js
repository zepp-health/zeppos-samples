import { MessageBuilder } from '../shared/message'

const messageBuilder = new MessageBuilder()

// Simulating an asynchronous network request using Promise
const mockAPI = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        body: {
          data: {
            text: 'HELLO ZEPPOS'
          }
        }
      })
    }, 1000)
  })
}

const fetchData = async (ctx) => {
  try {
    // Requesting network data using the fetch API
    // The sample program is for simulation only and does not request real network data, so it is commented here
    // const { body: { data = {} } = {} } = await fetch('https://xxx.com/api/xxx')  

    // A network request is simulated here
    const { body: { data = {} } = {} } = await mockAPI()

    ctx.response({
      data: { jsonrpc: 'hmrpcv1', result: data },
    })

  } catch (error) {
    ctx.response({
      data: { jsonrpc: 'hmrpcv1', result: 'ERROR' },
    })
  }
}

AppSideService({
  onInit() {
    messageBuilder.listen(() => {})

    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      if (jsonRpc.method === 'GET_DATA') {
        return fetchData(ctx)
      }
    })
  },

  onRun() {
  },

  onDestroy() {
  }
})
