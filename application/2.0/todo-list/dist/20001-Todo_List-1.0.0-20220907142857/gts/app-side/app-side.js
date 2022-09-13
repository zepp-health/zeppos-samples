
try {
  (() => {
  
class EventBus {
    constructor() {
        this.map = new Map();
    }
    on(type, cb) {
        if (this.map.has(type)) {
            this.map.get(type).push(cb);
        } else {
            this.map.set(type, [cb]);
        }
    }
    off(type, cb) {
        if (type) {
            if (cb) {
                const cbs = this.map.get(type);
                if (!cbs)
                    return;
                const index = cbs.findIndex(i => i === cb);
                if (index >= 0) {
                    cbs.splice(index, 1);
                }
            } else {
                this.map.delete(type);
            }
        } else {
            this.map.clear();
        }
    }
    emit(type, ...args) {
        for (let cb of this.map.get(type) ? this.map.get(type) : []) {
            cb && cb(...args);
        }
    }
    count(type) {
        return this.map.get(type) ? this.map.get(type).length : 0;
    }
}
function Deferred() {
    const defer = {};
    defer.promise = new Promise(function (resolve, reject) {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}
function timeout(ms, cb) {
    const defer = Deferred();
    ms = ms || 1000;
    const wait = setTimeout(() => {
        clearTimeout(wait);
        if (cb) {
            cb && cb(defer.resolve, defer.reject);
        } else {
            defer.reject('Timed out in ' + ms + 'ms.');
        }
    }, ms);
    return defer.promise;
}
function json2buf(json) {
    return str2buf(json2str(json));
}
function buf2json(buf) {
    return str2json(buf2str(buf));
}
function str2json(str) {
    return JSON.parse(str);
}
function json2str(json) {
    return JSON.stringify(json);
}
function str2buf(str) {
    return Buffer.from(str, 'utf-8');
}
function buf2str(buf) {
    return buf.toString('utf-8');
}
function bin2buf(bin) {
    return Buffer.from(bin);
}
function buf2hex(buf) {
    return buf.toString('hex');
}
function bin2hex(bin) {
    return buf2hex(bin2buf(bin));
}
let logger;
function initLogger() {
    logger = Logger.getLogger('side-message');
}
const DEBUG = true;
const MESSAGE_SIZE = 3600;
const MESSAGE_HEADER = 16;
const MESSAGE_PAYLOAD = MESSAGE_SIZE - MESSAGE_HEADER;
const HM_MESSAGE_PROTO_HEADER = 66;
const HM_MESSAGE_PROTO_PAYLOAD = MESSAGE_PAYLOAD - HM_MESSAGE_PROTO_HEADER;
const MessageFlag = {
    Runtime: 0,
    App: 1
};
const MessageType = {
    Shake: 1,
    Close: 2,
    Heart: 3,
    Data: 4,
    DataWithSystemTool: 5,
    Log: 6
};
const MessageVersion = { Version1: 1 };
const MessagePayloadType = {
    Request: 1,
    Response: 2,
    Notify: 3
};
const DataType = {
    empty: 'empty',
    json: 'json',
    text: 'text',
    bin: 'bin'
};
const MessagePayloadDataTypeOp = {
    EMPTY: 0,
    TEXT: 1,
    JSON: 2,
    BIN: 3
};
function getDataType(type) {
    switch (type.toLowerCase()) {
    case DataType.json:
        return MessagePayloadDataTypeOp.JSON;
    case DataType.text:
        return MessagePayloadDataTypeOp.TEXT;
    case DataType.bin:
        return MessagePayloadDataTypeOp.BIN;
    case DataType.empty:
        return MessagePayloadDataTypeOp.EMPTY;
    default:
        return MessagePayloadDataTypeOp.TEXT;
    }
}
const MessagePayloadOpCode = {
    Continued: 0,
    Finished: 1
};
let traceId = 10000;
function genTraceId() {
    return traceId++;
}
let spanId = 1000;
function genSpanId() {
    return spanId++;
}
function getTimestamp(t = Date.now()) {
    return t % 10000000;
}
class Session extends EventBus {
    constructor(id, type, ctx) {
        super();
        this.id = id;
        this.type = type;
        this.ctx = ctx;
        this.tempBuf = null;
        this.chunks = [];
        this.count = 0;
        this.finishChunk = null;
    }
    addChunk(payload) {
        if (payload.opCode === MessagePayloadOpCode.Finished) {
            this.count = payload.seqId;
            this.finishChunk = payload;
        }
        if (payload.payloadLength !== payload.payload.byteLength) {
            logger.error('receive chunk data length error, expect %d but %d', payload.payloadLength, payload.payload.byteLength);
            this.emit('error', Error(`receive chunk data length error, expect ${ payload.payloadLength } but ${ payload.payload.byteLength }`));
            return;
        }
        this.chunks.push(payload);
        this.checkIfReceiveAllChunks();
    }
    checkIfReceiveAllChunks() {
        if (this.count !== this.chunks.length)
            return;
        for (let i = 1; i <= this.count; i++) {
            const chunk = this.chunks.find(c => c.seqId === i);
            if (!chunk) {
                this.releaseBuf();
                this.emit('error', Error('receive data error'));
                return;
            }
            const buf = chunk.payload;
            this.tempBuf = this.tempBuf ? Buffer.concat([
                this.tempBuf,
                buf
            ]) : buf;
        }
        if (!this.finishChunk)
            return;
        this.finishChunk.payload = this.tempBuf;
        this.finishChunk.payloadLength = this.finishChunk.payload.byteLength;
        if (this.finishChunk.totalLength !== this.finishChunk.payloadLength) {
            logger.error('receive full data length error, expect %d but %d', this.finishChunk.payloadLength, this.finishChunk.payload.byteLength);
            this.emit('error', Error(`receive full data length error, expect ${ this.finishChunk.payloadLength } but ${ this.finishChunk.payload.byteLength }`));
            return;
        }
        this.emit('data', this.finishChunk);
    }
    getLength() {
        return this.tempBufLength;
    }
    releaseBuf() {
        this.tempBuf = null;
        this.chunks = [];
        this.finishChunk = null;
        this.count = 0;
    }
}
class SessionMgr {
    constructor() {
        this.sessions = new Map();
    }
    key(session) {
        return `${ session.id }:${ session.type }`;
    }
    newSession(id, type, ctx) {
        const newSession = new Session(id, type, ctx);
        this.sessions.set(this.key(newSession), newSession);
        return newSession;
    }
    destroy(session) {
        session.releaseBuf();
        this.sessions.delete(this.key(session));
    }
    has(id, type) {
        return this.sessions.has(this.key({
            id,
            type
        }));
    }
    getById(id, type) {
        return this.sessions.get(this.key({
            id,
            type
        }));
    }
    clear() {
        this.sessions.clear();
    }
}
class MessageBuilder extends EventBus {
    constructor({appId = 0, appDevicePort = 20, appSidePort = 0, ble = undefined} = {
        appId: 0,
        appDevicePort: 20,
        appSidePort: 0,
        ble: undefined
    }) {
        super();
        initLogger();
        this.isDevice = typeof __ZEPPOS__ !== 'undefined';
        this.isSide = !this.isDevice;
        this.appId = appId;
        this.appDevicePort = appDevicePort;
        this.appSidePort = appSidePort;
        this.ble = ble;
        this.sendMsg = this.getSafeSend();
        this.chunkSize = MESSAGE_PAYLOAD;
        this.tempBuf = null;
        this.shakeTask = Deferred();
        this.waitingShakePromise = this.shakeTask.promise;
        this.sessionMgr = new SessionMgr();
    }
    getMessageSize() {
        return MESSAGE_SIZE;
    }
    getMessagePayloadSize() {
        return MESSAGE_PAYLOAD;
    }
    getMessageHeaderSize() {
        return MESSAGE_HEADER;
    }
    buf2Json(buf) {
        return buf2json(buf);
    }
    json2Buf(json) {
        return json2buf(json);
    }
    now(t = Date.now()) {
        return getTimestamp(t);
    }
    connect(cb) {
        this.on('message', message => {
            this.onMessage(message);
        });
        this.ble && this.ble.createConnect((index, data, size) => {
            logger.warn('[RAW] [R] receive index=>%d size=>%d bin=>%s', index, size, bin2hex(data));
            this.onFragmentData(data);
        });
        this.sendShake();
        cb && cb(this);
    }
    disConnect(cb) {
        logger.debug('app ble disconnect');
        this.sendClose();
        this.off('message');
        this.ble && this.ble.disConnect();
        cb && cb(this);
    }
    listen(cb) {
        if (typeof messaging === 'undefined') {
            return;
        }
        messaging && messaging.peerSocket.addListener('message', message => {
            logger.warn('[RAW] [R] receive size=>%d bin=>%s', message.byteLength, bin2hex(message));
            this.onMessage(message);
        });
        this.waitingShakePromise = Promise.resolve();
        cb && cb(this);
    }
    buildBin(data) {
        if (data.payload.byteLength > this.chunkSize) {
            throw new Error(`${ data.payload.byteLength } greater than max size of ${ this.chunkSize }`);
        }
        const size = this.getMessageHeaderSize() + data.payload.byteLength;
        let buf = Buffer.alloc(size);
        let offset = 0;
        buf.writeUInt8(data.flag, offset);
        offset += 1;
        buf.writeUInt8(data.version, offset);
        offset += 1;
        buf.writeUInt16LE(data.type, offset);
        offset += 2;
        buf.writeUInt16LE(data.port1, offset);
        offset += 2;
        buf.writeUInt16LE(data.port2, offset);
        offset += 2;
        buf.writeUInt32LE(data.appId, offset);
        offset += 4;
        buf.writeUInt32LE(data.extra, offset);
        offset += 4;
        buf.fill(data.payload, offset, data.payload.byteLength + offset);
        return buf;
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
            payload: Buffer.from([this.appId])
        });
    }
    sendShake() {
        if (this.appSidePort === 0) {
            const shake = this.buildShake();
            this.sendMsg(shake);
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
            payload: Buffer.from([this.appId])
        });
    }
    sendClose() {
        if (this.appSidePort !== 0) {
            const close = this.buildClose();
            this.sendMsg(close);
        }
    }
    readBin(arrayBuf) {
        const buf = Buffer.from(arrayBuf);
        let offset = 0;
        const flag = buf.readUInt8(offset);
        offset += 1;
        const version = buf.readUInt8(offset);
        offset += 1;
        const type = buf.readUInt16LE(offset);
        offset += 2;
        const port1 = buf.readUInt16LE(offset);
        offset += 2;
        const port2 = buf.readUInt16LE(offset);
        offset += 2;
        const appId = buf.readUInt32LE(offset);
        offset += 4;
        const extra = buf.readUInt32LE(offset);
        offset += 4;
        const payload = buf.subarray(offset);
        return {
            flag,
            version,
            type,
            port1,
            port2,
            appId,
            extra,
            payload
        };
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
            payload
        });
    }
    sendBin(buf, debug = DEBUG) {
        debug && logger.warn('[RAW] [S] send size=%d bin=%s', buf.byteLength, bin2hex(buf.buffer));
        const result = this.ble.send(buf.buffer, buf.byteLength);
        if (!result) {
            throw Error('send message error');
        }
    }
    sendBinBySide(buf, debug = DEBUG) {
        debug && logger.warn('[RAW] [S] send size=%d bin=%s', buf.byteLength, bin2hex(buf.buffer));
        messaging && messaging.peerSocket.send(buf.buffer);
    }
    getSafeSend() {
        if (this.isDevice) {
            return this.sendBin.bind(this);
        } else {
            return this.sendBinBySide.bind(this);
        }
    }
    _logSend(buf) {
        this.sendMsg(buf, false);
    }
    sendHmProtocol({requestId, dataBin, type, contentType, dataType}, {
        messageType = MessageType.Data
    } = {}) {
        const headerSize = 0;
        const hmDataSize = HM_MESSAGE_PROTO_PAYLOAD;
        const userDataLength = dataBin.byteLength;
        let offset = 0;
        const _buf = Buffer.alloc(hmDataSize);
        const traceId = requestId ? requestId : genTraceId();
        const spanId = genSpanId();
        let seqId = 1;
        const count = Math.ceil(userDataLength / hmDataSize);
        function genSeqId() {
            return seqId++;
        }
        for (let i = 1; i <= count; i++) {
            this.errorIfBleDisconnect();
            if (i === count) {
                const tailSize = userDataLength - offset;
                const tailBuf = Buffer.alloc(headerSize + tailSize);
                dataBin.copy(tailBuf, headerSize, offset, offset + tailSize);
                offset += tailSize;
                this.sendDataWithSession({
                    traceId,
                    spanId: spanId,
                    seqId: genSeqId(),
                    payload: tailBuf,
                    type,
                    opCode: MessagePayloadOpCode.Finished,
                    totalLength: userDataLength,
                    contentType,
                    dataType
                }, { messageType });
                break;
            }
            dataBin.copy(_buf, headerSize, offset, offset + hmDataSize);
            offset += hmDataSize;
            this.sendDataWithSession({
                traceId,
                spanId: spanId,
                seqId: genSeqId(),
                payload: _buf,
                type,
                opCode: MessagePayloadOpCode.Continued,
                totalLength: userDataLength,
                contentType,
                dataType
            }, { messageType });
        }
        if (offset === userDataLength) {
            logger.debug('HmProtocol send ok msgSize=> %d dataSize=> %d', offset, userDataLength);
        } else {
            logger.error('HmProtocol send error msgSize=> %d dataSize=> %d', offset, userDataLength);
        }
    }
    sendSimpleProtocol({dataBin}, {
        messageType = MessageType.Data
    } = {}) {
        const dataSize = this.chunkSize;
        const headerSize = 0;
        const userDataLength = dataBin.byteLength;
        let offset = 0;
        const _buf = Buffer.alloc(dataSize);
        const count = Math.ceil(userDataLength / dataSize);
        for (let i = 1; i <= count; i++) {
            if (i === count) {
                const tailSize = userDataLength - offset;
                const tailBuf = Buffer.alloc(headerSize + tailSize);
                dataBin.copy(tailBuf, headerSize, offset, offset + tailSize);
                offset += tailSize;
                this.sendSimpleData({ payload: tailBuf }, { messageType });
                break;
            }
            dataBin.copy(_buf, headerSize, offset, offset + dataSize);
            offset += dataSize;
            this.sendSimpleData({ payload: _buf }, { messageType });
        }
    }
    sendJson({requestId = 0, json, type = MessagePayloadType.Request, contentType, dataType}) {
        const packageBin = json2buf(json);
        const traceId = requestId ? requestId : genTraceId();
        this.sendHmProtocol({
            requestId: traceId,
            dataBin: packageBin,
            type,
            contentType,
            dataType
        });
    }
    sendBuf({requestId = 0, buf, type = MessagePayloadType.Request, contentType, dataType}) {
        const traceId = requestId ? requestId : genTraceId();
        return this.sendHmProtocol({
            requestId: traceId,
            dataBin: buf,
            type,
            contentType,
            dataType
        });
    }
    sendLog(str) {
        const packageBuf = str2buf(str);
        this.sendSimpleProtocol({ dataBin: packageBuf }, { messageType: MessageType.Log });
    }
    sendDataWithSession({traceId, spanId, seqId, payload, type, opCode, totalLength, contentType, dataType}, {messageType}) {
        const payloadBin = this.buildPayload({
            traceId,
            spanId,
            seqId,
            totalLength,
            type,
            opCode,
            payload,
            contentType,
            dataType
        });
        let data = this.isDevice ? this.buildData(payloadBin, { type: messageType }) : payloadBin;
        this.sendMsg(data);
    }
    sendSimpleData({payload}, {messageType}) {
        let data = this.isDevice ? this.buildData(payload, { type: messageType }) : payload;
        this._logSend(data);
    }
    buildPayload(data) {
        const size = HM_MESSAGE_PROTO_HEADER + data.payload.byteLength;
        let buf = Buffer.alloc(size);
        let offset = 0;
        buf.writeUInt32LE(data.traceId, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(data.spanId, offset);
        offset += 4;
        buf.writeUInt32LE(data.seqId, offset);
        offset += 4;
        buf.writeUInt32LE(data.totalLength, offset);
        offset += 4;
        buf.writeUInt32LE(data.payload.byteLength, offset);
        offset += 4;
        buf.writeUInt8(data.type, offset);
        offset += 1;
        buf.writeUInt8(data.opCode, offset);
        offset += 1;
        buf.writeUInt32LE(this.now(), offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt8(data.contentType, offset);
        offset += 1;
        buf.writeUInt8(data.dataType, offset);
        offset += 1;
        buf.writeUInt16LE(0, offset);
        offset += 2;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.writeUInt32LE(0, offset);
        offset += 4;
        buf.fill(data.payload, offset, data.payload.byteLength + offset);
        return buf;
    }
    readPayload(arrayBuf) {
        const buf = Buffer.from(arrayBuf);
        let offset = 0;
        const traceId = buf.readUInt32LE(offset);
        offset += 4;
        const parentId = buf.readUInt32LE(offset);
        offset += 4;
        const spanId = buf.readUInt32LE(offset);
        offset += 4;
        const seqId = buf.readUInt32LE(offset);
        offset += 4;
        const totalLength = buf.readUInt32LE(offset);
        offset += 4;
        const payloadLength = buf.readUInt32LE(offset);
        offset += 4;
        const payloadType = buf.readUInt8(offset);
        offset += 1;
        const opCode = buf.readUInt8(offset);
        offset += 1;
        const timestamp1 = buf.readUInt32LE(offset);
        offset += 4;
        const timestamp2 = buf.readUInt32LE(offset);
        offset += 4;
        const timestamp3 = buf.readUInt32LE(offset);
        offset += 4;
        const timestamp4 = buf.readUInt32LE(offset);
        offset += 4;
        const timestamp5 = buf.readUInt32LE(offset);
        offset += 4;
        const timestamp6 = buf.readUInt32LE(offset);
        offset += 4;
        const timestamp7 = buf.readUInt32LE(offset);
        offset += 4;
        const contentType = buf.readUInt8(offset);
        offset += 1;
        const dataType = buf.readUInt8(offset);
        offset += 1;
        const extra1 = buf.readUInt16LE(offset);
        offset += 2;
        const extra2 = buf.readUInt32LE(offset);
        offset += 4;
        const extra3 = buf.readUInt32LE(offset);
        offset += 4;
        const payload = buf.subarray(offset);
        return {
            traceId,
            parentId,
            spanId,
            seqId,
            totalLength,
            payloadLength,
            payloadType,
            opCode,
            contentType,
            dataType,
            timestamp1,
            timestamp2,
            timestamp3,
            timestamp4,
            timestamp5,
            timestamp6,
            timestamp7,
            extra1,
            extra2,
            extra3,
            payload
        };
    }
    onFragmentData(bin) {
        const data = this.readBin(bin);
        this.emit('raw', bin);
        logger.debug('receive data=>', JSON.stringify(data));
        if (data.flag === MessageFlag.App && data.type === MessageType.Shake) {
            this.appSidePort = data.port2;
            logger.debug('appSidePort=>', data.port2);
            this.shakeTask.resolve();
        } else if (data.flag === MessageFlag.App && data.type === MessageType.Data && data.port2 === this.appSidePort) {
            this.emit('message', data.payload);
            this.emit('read', data);
        } else if (data.flag === MessageFlag.App && data.type === MessageType.DataWithSystemTool && data.port2 === this.appSidePort) {
            this.emit('message', data.payload);
            this.emit('read', data);
        } else if (data.flag === MessageFlag.App && data.type === MessageType.Log && data.port2 === this.appSidePort) {
            this.emit('log', data.payload);
        } else {
            logger.error('error appSidePort=>%d data=>%j', this.appSidePort, data);
        }
    }
    errorIfBleDisconnect() {
    }
    onMessage(messagePayload) {
        const payload = this.readPayload(messagePayload);
        let session = this.sessionMgr.getById(payload.traceId, payload.payloadType);
        if (!session) {
            session = this.sessionMgr.newSession(payload.traceId, payload.payloadType, this);
            session.on('data', fullPayload => {
                if (fullPayload.opCode === MessagePayloadOpCode.Finished) {
                    if (fullPayload.payloadType === MessagePayloadType.Request) {
                        this.emit('request', {
                            request: fullPayload,
                            response: ({data}) => {
                                this.response({
                                    requestId: fullPayload.traceId,
                                    contentType: fullPayload.contentType,
                                    dataType: fullPayload.dataType,
                                    data
                                });
                            }
                        });
                    } else if (fullPayload.payloadType === MessagePayloadType.Response) {
                        this.emit('response', fullPayload);
                    } else if (fullPayload.payloadType === MessagePayloadType.Notify) {
                        this.emit('call', fullPayload);
                    }
                    this.emit('data', fullPayload);
                    this.sessionMgr.destroy(session);
                }
            });
            session.on('error', error => {
                this.sessionMgr.destroy(session);
                this.emit('error', error);
            });
        }
        session.addChunk(payload);
    }
    request(data, opts) {
        const _request = () => {
            const defaultOpts = {
                timeout: 60000,
                contentType: 'json',
                dataType: 'json'
            };
            const requestId = genTraceId();
            const defer = Deferred();
            opts = Object.assign(defaultOpts, opts);
            const error = error => {
                this.off('error', error);
                defer.reject(error);
            };
            const transact = ({traceId, payload, dataType}) => {
                this.errorIfBleDisconnect();
                logger.debug('traceId=>%d payload=>%s', traceId, payload.toString('hex'));
                if (traceId === requestId) {
                    let result;
                    switch (dataType) {
                    case MessagePayloadDataTypeOp.TEXT:
                        result = buf2str(payload);
                        break;
                    case MessagePayloadDataTypeOp.BIN:
                        result = payload;
                        break;
                    case MessagePayloadDataTypeOp.JSON:
                        result = buf2json(payload);
                        break;
                    default:
                        result = buf2str(payload);
                        break;
                    }
                    logger.debug('request id=>%d payload=>%j', requestId, data);
                    logger.debug('response id=>%d payload=>%j', requestId, result);
                    this.off('response', transact);
                    this.off('error', error);
                    defer.resolve(result);
                }
            };
            this.on('response', transact);
            this.on('error', error);
            if (Buffer.isBuffer(data)) {
                this.sendBuf({
                    requestId,
                    buf: data,
                    type: MessagePayloadType.Request,
                    contentType: MessagePayloadDataTypeOp.BIN,
                    dataType: getDataType(opts.dataType)
                });
            } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                this.sendBuf({
                    requestId,
                    buf: Buffer.from(data),
                    type: MessagePayloadType.Request,
                    contentType: MessagePayloadDataTypeOp.BIN,
                    dataType: getDataType(opts.dataType)
                });
            } else {
                this.sendJson({
                    requestId,
                    json: data,
                    type: MessagePayloadType.Request,
                    contentType: MessagePayloadDataTypeOp.JSON,
                    dataType: getDataType(opts.dataType)
                });
            }
            let hasReturned = false;
            return Promise.race([
                timeout(opts.timeout, (resolve, reject) => {
                    if (hasReturned) {
                        return resolve();
                    }
                    logger.error(`request timeout in ${ opts.timeout }ms error=> %d data=> %j`, requestId, data);
                    this.off('response', transact);
                    reject(Error(`Timed out in ${ opts.timeout }ms.`));
                }),
                defer.promise.finally(() => {
                    hasReturned = true;
                })
            ]);
        };
        return this.waitingShakePromise.then(_request);
    }
    requestCb(data, opts, cb) {
        const _requestCb = () => {
            const defaultOpts = {
                timeout: 60000,
                contentType: 'json',
                dataType: 'json'
            };
            if (typeof opts === 'function') {
                cb = opts;
                opts = defaultOpts;
            } else {
                opts = Object.assign(defaultOpts, opts);
            }
            const requestId = genTraceId();
            let timer1 = null;
            let hasReturned = false;
            const transact = ({traceId, payload, dataType}) => {
                logger.debug('traceId=>%d payload=>%s', traceId, payload.toString('hex'));
                if (traceId === requestId) {
                    let result;
                    switch (dataType) {
                    case MessagePayloadDataTypeOp.TEXT:
                        result = buf2str(payload);
                        break;
                    case MessagePayloadDataTypeOp.BIN:
                        result = payload;
                        break;
                    case MessagePayloadDataTypeOp.JSON:
                        result = buf2json(payload);
                        break;
                    default:
                        result = buf2str(payload);
                        break;
                    }
                    logger.debug('request id=>%d payload=>%j', requestId, data);
                    logger.debug('response id=>%d payload=>%j', requestId, result);
                    timer1 && clearTimeout(timer1);
                    timer1 = null;
                    this.off('response', transact);
                    hasReturned = true;
                    cb(null, result);
                }
            };
            this.on('response', transact);
            if (Buffer.isBuffer(data)) {
                this.sendBuf({
                    requestId,
                    buf: data,
                    type: MessagePayloadType.Request,
                    contentType: MessagePayloadDataTypeOp.BIN,
                    dataType: getDataType(opts.dataType)
                });
            } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                this.sendBuf({
                    requestId,
                    buf: Buffer.from(data),
                    type: MessagePayloadType.Request,
                    contentType: MessagePayloadDataTypeOp.BIN,
                    dataType: getDataType(opts.dataType)
                });
            } else {
                this.sendJson({
                    requestId,
                    json: data,
                    type: MessagePayloadType.Request,
                    contentType: MessagePayloadDataTypeOp.JSON,
                    dataType: getDataType(opts.dataType)
                });
            }
            timer1 = setTimeout(() => {
                timer1 = null;
                if (hasReturned) {
                    return;
                }
                logger.error(`request time out in ${ opts.timeout }ms error=>%d data=>%j`, requestId, data);
                this.off('response', transact);
                cb(Error(`Timed out in ${ opts.timeout }ms.`));
            }, opts.timeout);
        };
        return this.waitingShakePromise.then(_requestCb);
    }
    response({requestId, contentType, dataType, data}) {
        if (MessagePayloadDataTypeOp.BIN === dataType) {
            this.sendBuf({
                requestId,
                buf: data,
                type: MessagePayloadType.Response,
                contentType,
                dataType
            });
        } else {
            this.sendJson({
                requestId,
                json: data,
                type: MessagePayloadType.Response,
                contentType,
                dataType
            });
        }
    }
    call(data) {
        return this.waitingShakePromise.then(() => {
            if (Buffer.isBuffer(data)) {
                return this.sendBuf({
                    buf: data,
                    type: MessagePayloadType.Notify,
                    contentType: MessagePayloadDataTypeOp.BIN,
                    dataType: MessagePayloadDataTypeOp.EMPTY
                });
            } else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                return this.sendBuf({
                    buf: Buffer.from(data),
                    type: MessagePayloadType.Notify,
                    contentType: MessagePayloadDataTypeOp.BIN,
                    dataType: MessagePayloadDataTypeOp.EMPTY
                });
            } else {
                return this.sendJson({
                    json: data,
                    type: MessagePayloadType.Notify,
                    contentType: MessagePayloadDataTypeOp.JSON,
                    dataType: MessagePayloadDataTypeOp.EMPTY
                });
            }
        });
    }
}
const DEFAULT_TODO_LIST = [
    'Learn',
    'Drink',
    'Food'
];
const messageBuilder = new MessageBuilder();
function getTodoList() {
    return settings.settingsStorage.getItem('todoList') ? JSON.parse(settings.settingsStorage.getItem('todoList')) : [...DEFAULT_TODO_LIST];
}
AppSideService({
    onInit() {
        messageBuilder.listen(() => {
        });
        settings.settingsStorage.addListener('change', ({key, newValue, oldValue}) => {
            messageBuilder.call(getTodoList());
        });
        messageBuilder.on('request', ctx => {
            const payload = messageBuilder.buf2Json(ctx.request.payload);
            if (payload.method === 'GET_TODO_LIST') {
                ctx.response({ data: { result: getTodoList() } });
            } else if (payload.method === 'ADD') {
                const todoList = getTodoList();
                const newTodoList = [
                    ...todoList,
                    String(Math.floor(Math.random() * 100))
                ];
                settings.settingsStorage.setItem('todoList', JSON.stringify(newTodoList));
                ctx.response({ data: { result: newTodoList } });
            } else if (payload.method === 'DELETE') {
                const {
                    params: {index} = {}
                } = payload;
                const todoList = getTodoList();
                const newTodoList = todoList.filter((_, i) => i !== index);
                settings.settingsStorage.setItem('todoList', JSON.stringify(newTodoList));
                ctx.response({ data: { result: newTodoList } });
            }
        });
    },
    onRun() {
    },
    onDestroy() {
    }
});

  })()
} catch(e) {
  console.log(e)
/* todo */
}