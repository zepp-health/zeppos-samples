import './buffer'
import './logger'
import { EventBus } from './event'
import { Deferred, timeout } from './defer'
import { json2Buf, buf2Json, buf2hex, bin2hex, bin2json, str2buf } from './data'
import { isHmBleDefined, isHmAppDefined } from './js-module'

let logger

if (isHmAppDefined()) {
  logger = Logger.getLogger('device-message')
  // logger.level = logger.levels.warn
} else {
  logger = Logger.getLogger('side-message')
}

const DEBUG = false

export const MessageFlag = {
  App: 0x1,
}

export const MessageType = {
  Shake: 0x1,
  Close: 0x2,
  Heart: 0x3,
  Data: 0x4,
  DataWithSystemTool: 0x5,
  Log: 0x6,
}

export const MessageVersion = {
  Version1: 0x1,
}

export const MessagePayloadType = {
  Request: 0x1,
  Response: 0x2,
  Notify: 0x3,
}

export const MessagePayloadOpCode = {
  Continued: 0x0,
  Finished: 0x1,
}

let traceId = 10000
export function genTraceId() {
  return traceId++
}

let spanId = 1000
export function genSpanId() {
  return spanId++
}

export function getTimestamp(t = Date.now()) {
  return t % 10000000
}

class Session extends EventBus {
  constructor(id, type, ctx) {
    super()
    this.id = id
    this.type = type // payloadType
    this.ctx = ctx
    this.tempBuf = null
    this.chunks = []
    this.count = 0
    this.finishChunk = null
  }

  addChunk(payload) {
    if (payload.opCode === MessagePayloadOpCode.Finished) {
      this.count = payload.seqId
      this.finishChunk = payload
    }

    if (payload.payloadLength !== payload.payload.byteLength) {
      logger.error(
        'receive chunk data length error, expect %d but %d',
        payload.payloadLength,
        payload.payload.byteLength,
      )
      this.emit(
        'error',
        Error(
          `receive chunk data length error, expect ${payload.payloadLength} but ${payload.payload.byteLength}`,
        ),
      )
      return
    }

    this.chunks.push(payload)
    this.checkIfReceiveAllChunks()
  }

  checkIfReceiveAllChunks() {
    if (this.count !== this.chunks.length) return

    for (let i = 1; i <= this.count; i++) {
      const chunk = this.chunks.find((c) => c.seqId === i)

      if (!chunk) {
        this.releaseBuf()
        this.emit('error', Error('receive data error'))
        return
      }

      const buf = chunk.payload
      this.tempBuf = this.tempBuf ? Buffer.concat([this.tempBuf, buf]) : buf
    }

    if (!this.finishChunk) return

    this.finishChunk.payload = this.tempBuf
    this.finishChunk.payloadLength = this.finishChunk.payload.byteLength

    if (this.finishChunk.totalLength !== this.finishChunk.payloadLength) {
      logger.error(
        'receive full data length error, expect %d but %d',
        this.finishChunk.payloadLength,
        this.finishChunk.payload.byteLength,
      )
      this.emit(
        'error',
        Error(
          `receive full data length error, expect ${this.finishChunk.payloadLength} but ${this.finishChunk.payload.byteLength}`,
        ),
      )
      return
    }

    this.emit('data', this.finishChunk)
  }

  getLength() {
    return this.tempBufLength
  }
  releaseBuf() {
    this.tempBuf = null
    this.chunks = []
    this.finishChunk = null
    this.count = 0
  }
}

class SessionMgr {
  constructor() {
    this.sessions = new Map()
  }

  key(session) {
    return `${session.id}:${session.type}`
  }

  newSession(id, type, ctx) {
    const newSession = new Session(id, type, ctx)
    this.sessions.set(this.key(newSession), newSession)
    return newSession
  }

  destroy(session) {
    session.releaseBuf()
    this.sessions.delete(this.key(session))
  }

  has(id, type) {
    return this.sessions.has(this.key({ id, type }))
  }

  getById(id, type) {
    return this.sessions.get(this.key({ id, type }))
  }

  clear() {
    this.sessions.clear()
  }
}

export class MessageBuilder extends EventBus {
  constructor(
    { appId = 0, appDevicePort = 20, appSidePort = 0 } = {
      appId: 0,
      appDevicePort: 20,
      appSidePort: 0,
    },
  ) {
    super()
    this.isDevice = isHmBleDefined()
    this.isSide = !this.isDevice

    this.appId = appId
    this.appDevicePort = appDevicePort
    this.appSidePort = appSidePort
    this.sendMsg = this.getSafeSend()
    this.chunkSize = 2000
    this.tempBuf = null
    this.shakeTask = Deferred()
    this.waitingShakePromise = this.shakeTask.promise
    this.sessionMgr = new SessionMgr()

    if (isHmAppDefined() && DEBUG) {
      logger.connect({
        log: (logEvent) => {
          this.log(JSON.stringify(logEvent))
        },
      })
    }
  }

  now(t = Date.now()) {
    return getTimestamp(t)
  }

  connect(cb) {
    this.on('message', (message) => {
      this.onMessage(message)
    })

    hmBle &&
      hmBle.createConnect((index, data, size) => {
        logger.warn(
          '[RAW] [R] receive index=>%d size=>%d bin=>%s',
          index,
          size,
          this.bin2hex(data),
        )
        this.onFragmentData(data)
      })

    this.sendShake()
    cb && cb(this)
  }

  disConnect(cb) {
    logger.debug('app ble disconnect')
    this.sendClose()
    this.off('message')
    hmBle && hmBle.disConnect()

    cb && cb(this)
  }

  listen(cb) {
    messaging &&
      messaging.peerSocket.addListener('message', (message) => {
        logger.warn(
          '[RAW] [R] receive size=>%d bin=>%s',
          message.byteLength,
          this.bin2hex(message),
        )
        this.onMessage(message)
      })

    this.waitingShakePromise = Promise.resolve()
    cb && cb(this)
  }

  buildBin(data) {
    const size = 16 + data.payload.byteLength
    let buf = Buffer.alloc(size)
    let offset = 0

    buf.writeUInt8(data.flag, offset)
    offset += 1

    buf.writeUInt8(data.version, offset)
    offset += 1

    buf.writeUInt16LE(data.type, offset)
    offset += 2

    buf.writeUInt16LE(data.port1, offset)
    offset += 2

    buf.writeUInt16LE(data.port2, offset)
    offset += 2

    buf.writeUInt32LE(data.appId, offset)
    offset += 4

    buf.writeUInt32LE(data.extra, offset)
    offset += 4

    buf.fill(data.payload, offset, data.payload.byteLength + offset)

    return buf
  }

  buildShake() {
    return this.buildBin({
      flag: MessageFlag.App,
      version: MessageVersion.Version1,
      type: MessageType.Shake,
      port1: this.appDevicePort,
      port2: this.appSidePort,
      appId: this.appId,
      extra: 0,
      payload: Buffer.from([this.appId]),
    })
  }

  sendShake() {
    if (this.appSidePort === 0) {
      const shake = this.buildShake()
      this.sendMsg(shake)
    }
  }

  buildClose() {
    return this.buildBin({
      flag: MessageFlag.App,
      version: MessageVersion.Version1,
      type: MessageType.Close,
      port1: this.appDevicePort,
      port2: this.appSidePort,
      appId: this.appId,
      extra: 0,
      payload: Buffer.from([this.appId]),
    })
  }

  sendClose() {
    if (this.appSidePort !== 0) {
      const close = this.buildClose()

      this.sendMsg(close)
    }
  }

  readBin(arrayBuf) {
    const buf = Buffer.from(arrayBuf)
    let offset = 0

    const flag = buf.readUInt8(offset)
    offset += 1

    const version = buf.readUInt8(offset)
    offset += 1

    const type = buf.readUInt16LE(offset)
    offset += 2

    const port1 = buf.readUInt16LE(offset)
    offset += 2

    const port2 = buf.readUInt16LE(offset)
    offset += 2

    const appId = buf.readUInt32LE(offset)
    offset += 4

    const extra = buf.readUInt32LE(offset)
    offset += 4

    const payload = buf.subarray(offset)

    return {
      flag,
      version,
      type,
      port1,
      port2,
      appId,
      extra,
      payload,
    }
  }

  buildData(payload, opts = {}) {
    return this.buildBin({
      flag: MessageFlag.App,
      version: MessageVersion.Version1,
      type: MessageType.Data,
      port1: this.appDevicePort,
      port2: this.appSidePort,
      appId: this.appId,
      extra: 0,
      ...opts,
      payload,
    })
  }

  json2Buf(obj) {
    return json2Buf(obj)
  }

  buf2Json(buf) {
    return buf2Json(buf)
  }

  buf2hex(buf) {
    return buf2hex(buf)
  }

  bin2hex(bin) {
    return bin2hex(bin)
  }

  bin2json(bin) {
    return bin2json(bin)
  }

  sendBin(buf) {
    logger.warn(
      '[RAW] [S] send size=%d bin=%s',
      buf.byteLength,
      this.bin2hex(buf.buffer),
    )
    hmBle.send(buf.buffer, buf.byteLength)
  }

  sendBinBySide(buf) {
    logger.warn(
      '[RAW] [S] send size=%d bin=%s',
      buf.byteLength,
      this.bin2hex(buf.buffer),
    )
    messaging.peerSocket.send(buf.buffer)
  }

  getSafeSend() {
    if (this.isDevice) {
      return this.sendBin.bind(this)
    } else {
      return this.sendBinBySide.bind(this)
    }
  }

  _logSend(buf) {
    if (this.isDevice) {
      hmBle.send(buf.buffer, buf.byteLength)
    } else {
      messaging.peerSocket.send(buf.buffer)
    }
  }

  sendHmProtocol(
    { requestId, dataBin, type },
    { messageType = MessageType.Data } = {},
  ) {
    const dataSize = this.chunkSize
    const headerSize = 0
    const userDataLength = dataBin.byteLength

    let offset = 0
    const _buf = Buffer.alloc(dataSize)
    const traceId = requestId ? requestId : genTraceId()
    const spanId = genSpanId()
    let seqId = 1

    const count = Math.ceil(userDataLength / dataSize)

    function genSeqId() {
      return seqId++
    }

    for (let i = 1; i <= count; i++) {
      if (i === count) {
        const tailSize = userDataLength - offset
        const tailBuf = Buffer.alloc(headerSize + tailSize)

        dataBin.copy(tailBuf, headerSize, offset, offset + tailSize)
        offset += tailSize
        this.sendDataWithSession(
          {
            traceId,
            spanId: spanId,
            seqId: genSeqId(),
            payload: tailBuf,
            type,
            opCode: MessagePayloadOpCode.Finished,
            totalLength: userDataLength,
          },
          { messageType },
        )

        break
      }

      dataBin.copy(_buf, headerSize, offset, offset + dataSize)
      offset += dataSize

      this.sendDataWithSession(
        {
          traceId,
          spanId: spanId,
          seqId: genSeqId(),
          payload: _buf,
          type,
          opCode: MessagePayloadOpCode.Continued,
          totalLength: userDataLength,
        },
        { messageType },
      )
    }

    if (offset === userDataLength) {
      logger.debug(
        'HmProtocol send ok msgSize=> %d dataSize=> %d',
        offset,
        userDataLength,
      )
    } else {
      logger.error(
        'HmProtocol send error msgSize=> %d dataSize=> %d',
        offset,
        userDataLength,
      )
    }
  }

  sendSimpleProtocol({ dataBin }, { messageType = MessageType.Data } = {}) {
    const dataSize = this.chunkSize
    const headerSize = 0
    const userDataLength = dataBin.byteLength

    let offset = 0
    const _buf = Buffer.alloc(dataSize)

    const count = Math.ceil(userDataLength / dataSize)

    for (let i = 1; i <= count; i++) {
      if (i === count) {
        // last
        const tailSize = userDataLength - offset
        const tailBuf = Buffer.alloc(headerSize + tailSize)

        dataBin.copy(tailBuf, headerSize, offset, offset + tailSize)
        offset += tailSize
        this.sendSimpleData({ payload: tailBuf }, { messageType })

        break
      }

      dataBin.copy(_buf, headerSize, offset, offset + dataSize)
      offset += dataSize

      this.sendSimpleData({ payload: _buf }, { messageType })
    }

    if (offset === userDataLength) {
      // logger.debug('SimpleProtocol send ok msgSize=> %d dataSize=> %d', offset, userDataLength)
    } else {
      // logger.error('SimpleProtocol send error msgSize=> %d dataSize=> %d', offset, userDataLength)
    }
  }

  sendJson({ requestId = 0, json, type = MessagePayloadType.Request }) {
    const packageBin = this.json2Buf(json)
    const traceId = requestId ? requestId : genTraceId()

    this.sendHmProtocol({ requestId: traceId, dataBin: packageBin, type })
  }

  sendLog(str) {
    const packageBuf = str2buf(str)

    this.sendSimpleProtocol(
      { dataBin: packageBuf },
      { messageType: MessageType.Log },
    )
  }

  sendDataWithSession(
    { traceId, spanId, seqId, payload, type, opCode, totalLength },
    { messageType },
  ) {
    const payloadBin = this.buildPayload({
      traceId,
      spanId,
      seqId,
      totalLength,
      type,
      opCode,
      payload,
    })

    let data = this.isDevice
      ? this.buildData(payloadBin, { type: messageType })
      : payloadBin

    this.sendMsg(data)
  }

  sendSimpleData({ payload }, { messageType }) {
    let data = this.isDevice
      ? this.buildData(payload, { type: messageType })
      : payload

    this._logSend(data)
  }

  buildPayload(data) {
    const size = 66 + data.payload.byteLength
    let buf = Buffer.alloc(size)
    let offset = 0

    // header
    // traceId
    buf.writeUInt32LE(data.traceId, offset)
    offset += 4

    // parentId
    buf.writeUInt32LE(0, offset)
    offset += 4

    // spanId
    buf.writeUInt32LE(data.spanId, offset)
    offset += 4

    // seqId 
    buf.writeUInt32LE(data.seqId, offset)
    offset += 4

    // message total length
    buf.writeUInt32LE(data.totalLength, offset)
    offset += 4

    // payload length
    buf.writeUInt32LE(data.payload.byteLength, offset)
    offset += 4

    // payload type
    buf.writeUInt8(data.type, offset)
    offset += 1

    // opCode
    buf.writeUInt8(data.opCode, offset)
    offset += 1

    // timestamp1
    buf.writeUInt32LE(this.now(), offset)
    offset += 4

    // timestamp2
    buf.writeUInt32LE(0, offset)
    offset += 4

    // timestamp3
    buf.writeUInt32LE(0, offset)
    offset += 4

    // timestamp4
    buf.writeUInt32LE(0, offset)
    offset += 4

    // timestamp5
    buf.writeUInt32LE(0, offset)
    offset += 4

    // timestamp6
    buf.writeUInt32LE(0, offset)
    offset += 4

    // timestamp7
    buf.writeUInt32LE(0, offset)
    offset += 4

    // timestamp8
    buf.writeUInt32LE(0, offset)
    offset += 4

    // extra1
    buf.writeUInt32LE(0, offset)
    offset += 4

    // extra2
    buf.writeUInt32LE(0, offset)
    offset += 4

    // payload
    buf.fill(data.payload, offset, data.payload.byteLength + offset)

    return buf
  }

  readPayload(arrayBuf) {
    const buf = Buffer.from(arrayBuf)
    let offset = 0

    const traceId = buf.readUInt32LE(offset)
    offset += 4

    const parentId = buf.readUInt32LE(offset)
    offset += 4

    const spanId = buf.readUInt32LE(offset)
    offset += 4

    const seqId = buf.readUInt32LE(offset)
    offset += 4

    const totalLength = buf.readUInt32LE(offset)
    offset += 4

    const payloadLength = buf.readUInt32LE(offset)
    offset += 4

    const payloadType = buf.readUInt8(offset)
    offset += 1

    const opCode = buf.readUInt8(offset)
    offset += 1

    const timestamp1 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp2 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp3 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp4 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp5 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp6 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp7 = buf.readUInt32LE(offset)
    offset += 4

    const timestamp8 = buf.readUInt32LE(offset)
    offset += 4

    const extra1 = buf.readUInt32LE(offset)
    offset += 4

    const extra2 = buf.readUInt32LE(offset)
    offset += 4

    const payload = buf.subarray(offset)

    return {
      traceId,
      parentId,
      spanId,
      seqId,
      totalLength,
      payloadLength,
      payloadType,
      opCode,
      timestamp1,
      timestamp2,
      timestamp3,
      timestamp4,
      timestamp5,
      timestamp6,
      timestamp7,
      timestamp8,
      extra1,
      extra2,
      payload,
    }
  }

  onFragmentData(bin) {
    const data = this.readBin(bin)
    this.emit('raw', bin)

    logger.debug('recevie data=>', JSON.stringify(data))
    if (data.flag === MessageFlag.App && data.type === MessageType.Shake) {
      this.appSidePort = data.port2
      logger.debug('appSidePort=>', data.port2)
      this.shakeTask.resolve()
    } else if (
      data.flag === MessageFlag.App &&
      data.type === MessageType.Data &&
      data.port2 === this.appSidePort
    ) {
      this.emit('message', data.payload)
      this.emit('read', data)
    } else if (
      data.flag === MessageFlag.App &&
      data.type === MessageType.DataWithSystemTool &&
      data.port2 === this.appSidePort
    ) {
      this.emit('message', data.payload)
      this.emit('read', data)
    } else if (
      data.flag === MessageFlag.App &&
      data.type === MessageType.Log &&
      data.port2 === this.appSidePort
    ) {
      this.emit('log', data.payload)
    } else {
      logger.error('error appSidePort=>%d data=>%j', this.appSidePort, data)
    }
  }

  onMessage(messagePayload) {
    const payload = this.readPayload(messagePayload)
    let session = this.sessionMgr.getById(payload.traceId, payload.payloadType)

    if (!session) {
      session = this.sessionMgr.newSession(
        payload.traceId,
        payload.payloadType,
        this,
      )

      session.on('data', (fullPayload) => {
        if (fullPayload.opCode === MessagePayloadOpCode.Finished) {
          if (fullPayload.payloadType === MessagePayloadType.Request) {
            this.emit('request', {
              request: fullPayload,
              response: ({ data }) => {
                this.response({ requestId: fullPayload.traceId, data })
              },
            })
          } else if (fullPayload.payloadType === MessagePayloadType.Response) {
            this.emit('response', fullPayload)
          } else if (fullPayload.payloadType === MessagePayloadType.Notify) {
            this.emit('call', fullPayload)
          }

          this.emit('data', fullPayload)
          this.sessionMgr.destroy(session)
        }
      })

      session.on('error', (error) => {
        this.sessionMgr.destroy(session)
        this.emit('error', error)
      })
    }

    session.addChunk(payload)
  }

  request(data, opts) {
    const _request = () => {
      const defaultOpts = { timeout: 60000 }
      const requestId = genTraceId()
      const defer = Deferred()
      opts = Object.assign(defaultOpts, opts)

      const error = (error) => {
        this.off('error', error)
        defer.reject(error)
      }

      const transact = ({ traceId, payload }) => {
        logger.debug(
          'traceId=>%d payload=>%s',
          traceId,
          payload.toString('hex'),
        )
        if (traceId === requestId) {
          const resultJson = this.buf2Json(payload)
          logger.debug('request id=>%d payload=>%j', requestId, data)
          logger.debug('response id=>%d payload=>%j', requestId, resultJson)

          this.off('response', transact)
          this.off('error', error)
          defer.resolve(resultJson)
        }
      }

      this.on('response', transact)
      this.on('error', error)
      this.sendJson({ requestId, json: data, type: MessagePayloadType.Request })

      let hasReturned = false

      return Promise.race([
        timeout(opts.timeout, (resolve, reject) => {
          if (hasReturned) {
            return resolve()
          }

          logger.error(
            `request timeout in ${opts.timeout}ms error=> %d data=> %j`,
            requestId,
            data,
          )
          this.off('response', transact)

          reject(Error(`Timed out in ${opts.timeout}ms.`))
        }),
        defer.promise.finally(() => {
          hasReturned = true
        }),
      ])
    }

    return this.waitingShakePromise.then(_request)
  }

  requestCb(data, opts, cb) {
    const _requestCb = () => {
      const defaultOpts = { timeout: 60000 }

      if (typeof opts === 'function') {
        cb = opts
        opts = defaultOpts
      } else {
        opts = Object.assign(defaultOpts, opts)
      }

      const requestId = genTraceId()
      let timer1 = null
      let hasReturned = false

      const transact = ({ traceId, payload }) => {
        logger.debug(
          'traceId=>%d payload=>%s',
          traceId,
          payload.toString('hex'),
        )
        if (traceId === requestId) {
          const resultJson = this.buf2Json(payload)
          logger.debug('request id=>%d payload=>%j', requestId, data)
          logger.debug('response id=>%d payload=>%j', requestId, resultJson)

          this.off('response', transact)
          timer1 && clearTimeout(timer1)
          timer1 = null
          hasReturned = true
          cb(null, resultJson)
        }
      }

      this.on('response', transact)
      this.sendJson({ requestId, json: data, type: MessagePayloadType.Request })

      timer1 = setTimeout(() => {
        timer1 = null
        if (hasReturned) {
          return
        }

        logger.error(
          `request time out in ${opts.timeout}ms error=>%d data=>%j`,
          requestId,
          data,
        )
        this.off('response', transact)
        cb(Error(`Timed out in ${opts.timeout}ms.`))
      }, opts.timeout)
    }

    return this.waitingShakePromise.then(_requestCb)
  }

  response({ requestId, data }) {
    this.sendJson({ requestId, json: data, type: MessagePayloadType.Response })
  }

  call(data) {
    return this.waitingShakePromise.then(() => {
      return this.sendJson({ json: data, type: MessagePayloadType.Notify })
    })
  }

  log(str) {
    return this.waitingShakePromise.then(() => {
      return this.sendLog(str)
    })
  }
}
