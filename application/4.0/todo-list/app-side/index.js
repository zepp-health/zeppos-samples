import { BaseSideService } from '@zeppos/zml/base-side'
import { settingsLib } from '@zeppos/zml/base-side'

import { DEFAULT_TODO_LIST } from './../utils/constants'

function getTodoList() {
  return settingsLib.getItem('todoList')
    ? JSON.parse(settingsLib.getItem('todoList'))
    : [...DEFAULT_TODO_LIST]
}
AppSideService(
  BaseSideService({
    onInit() {},
    onRequest(req, res) {
      if (req.method === 'GET_TODO_LIST') {
        res(null, {
          result: getTodoList()
        })
      } else if (req.method === 'ADD') {
        // 这里补充一个
        const todoList = getTodoList()
        const newTodoList = [...todoList, String(Math.floor(Math.random() * 100))]
        settingsLib.setItem('todoList', JSON.stringify(newTodoList))

        res(null, {
          result: newTodoList
        })
      } else if (req.method === 'DELETE') {
        const { index } = req.params
        const todoList = getTodoList()
        const newTodoList = todoList.filter((_, i) => i !== index)
        settingsLib.setItem('todoList', JSON.stringify(newTodoList))

        res(null, {
          result: newTodoList
        })
      }
    },
    onSettingsChange({ key, newValue, oldValue }) {
      this.call({
        result: getTodoList()
      })
    },
    onRun() {},
    onDestroy() {}
  })
)
