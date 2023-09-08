export function Deferred() {
  const defer = {}

  defer.promise = new Promise(function (resolve, reject) {
    defer.resolve = resolve
    defer.reject = reject
  })

  return defer
}

export function delay(ms) {
  const defer = Deferred()

  setTimeout(defer.resolve, ms)

  return defer.promise
}

export function timeout(ms, cb) {
  const defer = Deferred()
  ms = ms || 1000

  const wait = setTimeout(() => {
    clearTimeout(wait)

    if (cb) {
      cb && cb(defer.resolve, defer.reject)
    } else {
      defer.reject('Timed out in ' + ms + 'ms.')
    }
  }, ms)

  return defer.promise
}
