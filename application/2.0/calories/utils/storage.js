import {
  statSync,
  writeFileSync,
  readFileSync
} from '@zos/fs'

export default class LocalStorage {
  constructor(fileName = "") {
    this.fileName = fileName
    this.contentObj = {}
  }

  set(obj) {
    writeFileSync({
      path: this.fileName,
      data: JSON.stringify(obj),
      options: {
        encoding: 'utf8'
      }
    })
  }

  get() {
    const fStat = statSync({
      path: this.fileName
    })
    if (fStat) {
      try {
        this.contentObj = JSON.parse(readFileSync({
          path: this.fileName,
          options: {
            encoding: 'utf8'
          }
        }))
      } catch (error) {
        this.contentObj = {}
      }
    }

    return this.contentObj
  }
}
