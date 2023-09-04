import { MessageBuilder } from '../shared/message-side'

const messageBuilder = new MessageBuilder()

const padStart = (str, maxLength, fillStr = '0') => {
  return str.toString().padStart(maxLength, fillStr)
}
const formatDate = (date = new Date()) => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const h = date.getHours()
  const mm = date.getMinutes()
  const s = date.getSeconds()

  return `${y}-${padStart(m, 2)}-${padStart(d, 2)} ${padStart(h, 2)}:${padStart(mm, 2)}:${padStart(s, 2)}`
}
// Simulating an asynchronous network request using Promise
const mockAPI = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const now = new Date()
      resolve({
        body: {
          data: {
            text: 'HELLO ZEPPOS: ' + formatDate()
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
    // Example of a GET method request
    // const { body: { data = {} } = {} } = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'GET'
    // })
    // Example of a POST method request
    // const { body: { data = {} } = {} } = await fetch({
    //   url: 'https://xxx.com/api/xxx',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     text: 'Hello Zepp OS'
    //   })
    // })

    // A network request is simulated here
    const { body: { data = {} } = {} } = await mockAPI()

    ctx.response({
      data: { result: data },
    })

  } catch (error) {
    ctx.response({
      data: { result: 'ERROR' },
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
