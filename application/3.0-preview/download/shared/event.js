export class EventBus {
  constructor() {
    this.listeners = new Map()
  }

  on(type, cb) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, [])
    }

    this.listeners.get(type).push(cb)
  }

  off(type, cb) {
    if (!type) return

    if (cb) {
      const cbs = this.listeners.get(type)

      if (!cbs) return
      const index = cbs.findIndex((i) => i === cb)

      if (index >= 0) {
        cbs.splice(index, 1)
      }
    } else {
      this.listeners.delete(type)
    }
  }

  emit(type, ...args) {
    for (const cb of this.listeners.get(type) ?? []) {
      cb && cb(...args)
    }
  }

  clear() {
    this.listeners.clear()
  }

  once(type, cb) {
    const onceCb = (...args) => {
      this.off(type, onceCb)
      cb(...args)
    }
    this.on(type, onceCb)
  }

  count(type) {
    return (this.listeners.get(type) ?? []).length
  }
}
