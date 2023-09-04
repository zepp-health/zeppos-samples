export function stringify(object) {
  const strArr = []
  for (const prop in object) {
    const key = encodeURIComponent(prop)
    const value = encodeURIComponent(object[prop])
    strArr.push(key + '=' + value)
  }
  return strArr.join('&')
}

export function parse(str) {
  const arr = str.split('&')
  const object = {}
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i].split('=')
    object[decodeURIComponent(item[0])] = decodeURIComponent(item[1])
  }
  return object
}
