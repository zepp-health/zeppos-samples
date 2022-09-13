export function json2Buf(json) {
  return str2buf(json2str(json))
}

export function len(binOrBuf) {
  return binOrBuf.byteLength
}

export function buf2Json(buf) {
  return str2json(buf2str(buf))
}

export function str2json(str) {
  return JSON.parse(str)
}

export function json2str(json) {
  return JSON.stringify(json)
}

export function str2buf(str) {
  return Buffer.from(str, 'utf-8')
}

export function buf2str(buf) {
  return buf.toString('utf-8')
}

export function bin2buf(bin) {
  return Buffer.from(bin)
}

export function buf2bin(buf) {
  return buf.buffer
}

export function buf2hex(buf) {
  return buf.toString('hex')
}

export function bin2hex(bin) {
  return buf2hex(bin2buf(bin))
}

export function bin2json(bin) {
  return buf2Json(bin2buf(bin))
}

export function bin2str(bin) {
  return buf2str(bin2buf(bin))
}

export function str2bin(str) {
  return buf2bin(str2buf(str))
}

export function allocOfBin(size = 0) {
  return Buffer.alloc(size).buffer
}

export function allocOfBuf(size = 0) {
  return Buffer.alloc(size)
}
