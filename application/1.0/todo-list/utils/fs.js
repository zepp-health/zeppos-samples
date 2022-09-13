import * as fs from './../shared/fs'
import { TODO_FILE_NAME } from './constants'

export function readFileSync() {
  const resData = fs.readFileSync(TODO_FILE_NAME)
  return !resData ? [] : JSON.parse(resData)
}

export function writeFileSync(data, merge = true) {
  let params = data
  if (merge) {
    params = [...readFileSync(), ...data]
  }
  fs.writeFileSync(TODO_FILE_NAME, JSON.stringify(params))
}
