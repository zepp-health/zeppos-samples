function str2ab(str) {
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export default class LocalStorage {
  constructor(fileName = "") {
    this.fileName = fileName;
    this.contentObj = {};
  }

  set(obj) {
    const file = hmFS.open(this.fileName, hmFS.O_RDWR | hmFS.O_TRUNC);
    const contentBuffer = str2ab(JSON.stringify(obj));

    hmFS.write(file, contentBuffer, 0, contentBuffer.byteLength);
    hmFS.close(file);
  }

  get() {
    const [fsStat, err] = hmFS.stat(this.fileName);
    if (err === 0) {
      const { size } = fsStat;
      const fileContentUnit = new Uint16Array(new ArrayBuffer(size));
      const file = hmFS.open(this.fileName, hmFS.O_RDONLY | hmFS.O_CREAT);
      hmFS.seek(file, 0, hmFS.SEEK_SET);
      hmFS.read(file, fileContentUnit.buffer, 0, size);
      hmFS.close(file);

      try {
        const val = String.fromCharCode.apply(null, fileContentUnit);
        this.contentObj = val ? JSON.parse(val) : {};
      } catch (error) {
        this.contentObj = {};
      }
    }

    return this.contentObj;
  }
}
