
export function getGlobal () {
  if (typeof self !== 'undefined') {
    return self
  }
  if (typeof window !== 'undefined') {
    return window
  }
  if (typeof global !== 'undefined') {
    return global
  }
  if (typeof globalThis !== 'undefined') {
    return globalThis
  }

  throw new Error('unable to locate global object')
}
