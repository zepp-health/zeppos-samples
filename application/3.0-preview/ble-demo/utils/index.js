export function ab2Arr(arrBuf) {
  let arrayList = Array.prototype.slice.call(new Uint8Array(arrBuf))
  return arrayList
}


export function ab2Str(buf) {
  let array_list = Array.prototype.slice.call(new Uint8Array(buf))
  return array_list
}

export function toBuffer(arr) {
  let buf = new Uint8Array(arr)
  buf = buf.buffer
  console.log(arr + 'The original array,' + Object.prototype.toString.call(arr))
  console.log(buf + 'return data,' + Object.prototype.toString.call(buf))
  console.log(ab2Str(buf).toString() + 'return data buffer')
  return buf
}

export function cmpLength(bArr, i) {
  return i < bArr.byteLength
}

export function toHex(v) {
  return v & 255
}

export function calc32Data(b, b2, b3, b4) {
  return toHex(b) + (toHex(b2) << 8) + (toHex(b3) << 16) + (toHex(b4) << 24)
}

export function c1(f, i) {
  return calibrate(f / 1000, i)
}

export function c2(f, i) {
  return calibrate(f * 0.0022046, i)
}

export function c3(f) {
  return (Math.floor(10 * f) % 10) >= 9 ? Math.floor(f + 1) : Math.floor(f)
}

export function calibrate(f, i) {
  let i2
  let i3
  if (i === 0) {
    i2 = Math.floor((c3(f * 1000) + 5) / 10)
  } else if (i === 1) {
    i2 = Math.floor((c3(f * 1000) + 10) / 10)
    if (i2 % 2 !== 0) {
      i2--
    }
  } else if (i !== 2) {
    if (i === 3) {
      i3 = Math.floor((c3(f * 100) + 5) / 10)
    } else if (i !== 4) {
      return f
    } else {
      i3 = Math.floor((c3(f * 100) + 10) / 10)
      if (i3 % 2 !== 0) {
        i3--
      }
    }
    return i3 / 10
  } else {
    i4 = Math.floor((Math.floor(f * 1000) + 21) / 10)
    if (i4 % 10 >= 5) {
      i2 = Math.floor(i4 / 10) * 10 + 5
    } else {
      i2 = Math.floor(i4 / 10) * 10
    }
  }
  return i2 / 100
}