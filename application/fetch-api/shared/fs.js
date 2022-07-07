const logger = DeviceRuntimeCore.HmLogger.getLogger('fs.js')

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf))
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  var bufView = new Uint16Array(buf)
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

/**
 * Get metadata of a file.
 * @param {} filename
 * @returns
 */
export function statSync(filename) {
  logger.log('statSync',filename)
  //获取文件信息
  const [fs_stat, err] = hmFS.stat(filename)
  logger.log('res',fs_stat, err)
  if (err == 0) {
    logger.log('fs--->size:', fs_stat.size)
    return fs_stat
  } else {
    logger.log('fs--->err:', err)
    return null
  }
}

/**
 * Write data to a file in a single operation. If a file with that name already exists, it is overwritten; otherwise, a new file is created.
 * @param {*} filename
 * @param {*} data
 * @param {*} options
 */
export function writeFileSync(filename, data, options) {
  logger.log('writeFileSync begin -->', filename)

  const stringBuffer = str2ab(data)
  const source_buf = new Uint8Array(stringBuffer)

  //打开/创建文件
  const file = hmFS.open(filename, hmFS.O_CREAT | hmFS.O_RDWR | hmFS.O_TRUNC)
  logger.log('writeFileSync file open success -->', file)
  //定位到文件开始位置
  hmFS.seek(file, 0, hmFS.SEEK_SET)
  //写入buffer
  hmFS.write(file, source_buf.buffer, 0, source_buf.length)
  //关闭文件
  hmFS.close(file)
  logger.log('writeFileSync success -->', filename)
}

/**
 * Read an entire file into a buffer in a single operation.
 * @param {*} filename
 * @param {*} options
 * @returns
 */
export function readFileSync(filename, options) {
  logger.log('readFileSync fiename:', filename)

  const fs_stat = statSync(filename)
  if (!fs_stat) return undefined

  const destination_buf = new Uint8Array(fs_stat.size)
  //打开/创建文件
  const file = hmFS.open(filename, hmFS.O_RDONLY)
  //定位到文件开始位置
  hmFS.seek(file, 0, hmFS.SEEK_SET)
  //读取buffer
  hmFS.read(file, destination_buf.buffer, 0, fs_stat.size)
  //关闭文件
  hmFS.close(file)

  const content = ab2str(destination_buf.buffer)
  //读取结果打印
  logger.log('readFileSync', content)
  return content
}

/**
 * Delete a file.
 * @param {*} filename
 */
export function unlinkSync(filename) {
  logger.log('unlinkSync begin -->', filename)
  const result = hmFS.remove(filename)
  logger.log('unlinkSync result -->', result)
  return result
}

/**
 * Rename a file.
 * @param {*} filename
 */
export function renameSync(oldFilename, newFilename) {
  logger.log('renameSync begin -->', filename)
  hmFS.rename(oldFilename, newFilename)
  logger.log('renameSync success -->', filename)
}

/**
 * Synchronously creates a directory.
 * @param {*} path
 * @param {*} options
 */
export function mkdirSync(path, options) {
  logger.log('mkdirSync begin -->', path)
  hmFS.mkdir(path)
  logger.log('mkdirSync success -->', path)
}

/**
 * Reads the contents of the directory.
 * @param {*} path
 * @param {*} options
 */
export function readdirSync(path, options) {
  logger.log('readdirSync begin -->', path)
  hmFS.readdirSync(path)
  logger.log('readdirSync success -->', path)
}

/**
 * Just to test the fs module
 */
export function test(fileName, dataString) {
  logger.log('saveData begin')

  writeFileSync(fileName, dataString)

  logger.log('fs_writeFileSync -> ', dataString)

  const content = readFileSync(fileName)

  logger.log('fs_readFileSync -> ', content)
}
