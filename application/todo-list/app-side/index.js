import { MessageBuilder } from '../shared/message'
import { DEFAULT_TODO_LIST } from './../utils/constants'
const messageBuilder = new MessageBuilder()

function getTodoList() {
  return settings.settingsStorage.getItem('todoList')
    ? JSON.parse(settings.settingsStorage.getItem('todoList'))
    : [...DEFAULT_TODO_LIST]
}
AppSideService({
  onInit() {
    messageBuilder.listen(() => {})
    settings.settingsStorage.addListener(
      'change',
      ({ key, newValue, oldValue }) => {
        messageBuilder.call(getTodoList())
      },
    )
    messageBuilder.on('request', (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload)
      if (jsonRpc.method === 'GET_TODO_LIST') {
        ctx.response({
          data: { jsonrpc: 'hmrpcv1', result: getTodoList() },
        })
      }
    })
  },
  onRun() {},
  onDestroy() {},
})
