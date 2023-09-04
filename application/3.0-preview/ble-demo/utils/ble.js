import * as hmBle from '@zos/ble'
import * as Utils from './index'

function createProfile(connectedId, mac) {
  console.log('----------createProfile')
  console.log('this is mac addr ====' + Utils.ab2Str(mac).toString())
  console.log('create profile connectedId =====' + connectedId)
  const profileObject = {
    pair: true, //(bool: 是否自动配对， 默认传0)
    id: connectedId, //(uint16_t: 设备ID)
    profile: 'scale', //(string: profile名称，自定义)
    dev: mac, //(uint8_t: ble mac地址 共6位)
    len: 1,
    //二级
    list: [
      {
        uuid: true, //(bool: 是否支持no -const uuid string， 默认传0)
        size: 1, //(uint16_t: 默认1, 表示service table数)
        len: 1,
        //三级
        list: [
          {
            uuid: 'FFE0', //(string: service uuid 字符串)
            permission: 0, //(uint16_t: 权限控制： 默认0 无控制)
            // inc: (uint16_t: 当前不用)
            serv: 0, //(string: 默认NULL)
            len1: 2, //(uint16_t: chara特征服务个数)
            len2: 2, //(下一级list长度)
            //四级
            list: [
              {
                uuid: '0000fff2-0000-1000-8000-00805f9b34fb', //(string: chara uuid字符串)
                permission: 32, //(uint16_t: 权限控制： 默认0 无控制)
                desc: 0, //(uint16_t: descListLen赋值： 支持订阅的特征服务)
                len: 0,
              },
              {
                uuid: '0000fff1-0000-1000-8000-00805f9b34fb', //(string: chara uuid字符串)
                permission: 32, //(uint16_t: 权限控制： 默认0 无控制)
                desc: 1, //(uint16_t: descListLen赋值： 支持订阅的特征服务)
                len: 1,
                //五级
                list: [
                  {
                    uuid: '2902', //(string: Descriptor UUID: "2902")
                    permission: 32,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
  console.log('This is creating a profile')
  hmBle.mstBuildProfile(profileObject)
}

function createListen(profile, uuid = 'fff1') {
  console.log('----------createListen')
  let arr = [1, 0]
  let data = Utils.toBuffer(arr)
  console.log(Utils.ab2Str(data).toString() + 'this is data num')
  hmBle.mstWriteDescriptor(profile, `0000${uuid}-0000-1000-8000-00805f9b34fb`, '2902', data, arr.length)
}

export function scanDevice(deviceName) {
  const { devEvent } = getApp()._options.globalData
  hmBle.mstStartScan(function (result) {
    console.log('--has been scanned---', result.dev_name)
    if (result.dev_name !== deviceName) {
      return
    }
    console.log('--target device----', JSON.stringify(result))
    devEvent.emit('scan', result.dev_addr)
  })
}

export function stopScanDevice() {
  console.log('--stop scan--')
  hmBle.mstStopScan()
}

export function startConnect(mac) {
  const { devEvent } = getApp()._options.globalData
  console.log('--start connect(need mac)--')
  hmBle.mstConnect(mac, function (conParam) {
    console.log('----------mstConnect')
    console.log(conParam.connected, conParam.connect_id)
    if (conParam.connected === 0) {
      console.log('**************connected')
      hmBle.mstDisconnect(() => {
        console.log('----------mstDisconnect')
        devEvent.emit('error')
      })
      hmBle.mstOnPrepare(function (preParam) {
        console.log('----------mstOnPrepare')
        if (preParam.status === 0) {
          console.log('**************prepared')
          createListen(preParam.profile)
        } else {
          console.log('===error mstOnPrepare')
          devEvent.emit('error')
        }
      })
      hmBle.mstOnCharaValueArrived(function (ccParam) {
        console.log('----------mstOnCharaValueArrived')
        console.log(ccParam.profile, ccParam.uuid, ccParam.status)
        if (ccParam.status === 0) {
          console.log('**************CharaValueArrived')
        } else {
          console.log('===error CharaValueArrived')
          devEvent.emit('error')
        }
      })
      hmBle.mstOnCharaWriteComplete(function (ccParam) {
        console.log('----------mstOnCharaWriteComplete')
        console.log(ccParam.profile, ccParam.uuid, ccParam.status)
        if (ccParam.status === 0) {
          console.log('**************CharaWriteComplete')
        } else {
          console.log('===error mstOnCharaWriteComplete')
          devEvent.emit('error')
        }
      })
      hmBle.mstOnDescValueArrived(function (param) {
        console.log('----------mstOnDescValueArrived')
      })
      hmBle.mstOnDescWriteComplete(function (dwcParam) {
        console.log('----------mstOnDescWriteComplete')
        console.log('*1***', dwcParam.chara)
        console.log('*2***', dwcParam.desc)
        console.log('*3***', dwcParam.status)
        console.log('*4***', dwcParam.profile)
      })
      hmBle.mstOnCharaNotification(function (cnParam) {
        console.log('----------mstOnCharaNotification')
        console.log('*1***', cnParam.uuid)
        console.log('*2***', cnParam.length)
        console.log('*3***', cnParam.profile)
        const arr = Utils.ab2Str(cnParam.data)

        console.log('*origin data***', JSON.stringify(arr))
        if (cnParam.data.byteLength < 6) {
          return
        }
        const dataview = new DataView(cnParam.data)
        const r = dataview.getUint16(7, true)
        if (r != 41313) {
          return
        } else if (Utils.cmpLength(cnParam.data, 19)) {
          const unit = dataview.getUint8(21)
          const w1 = Utils.calc32Data(dataview.getUint8(10), dataview.getUint8(11), dataview.getUint8(12), 0)
          let w2
          if (unit == 0) {
            if (w1 > 10000) {
              w2 = Math.round(Utils.c1(w1, 2) * 1000)
            } else {
              w2 = Math.round(Utils.c1(w1, 1) * 1000)
            }
          } else if (w1 > 10000) {
            w2 = Math.round(Utils.c2(w1, 3) / 0.0022046)
          } else {
            w2 = Math.round(Utils.c2(w1, 2) / 0.0022046)
          }

          const impedance = dataview.getUint16(13, true)
          let isStable = false
          if (dataview.getUint8(19) !== 0) {
            isStable = true
          }
          const impedanceEnabled = dataview.getUint8(20)
          const resultStr = `w1:${w1}, w2:${w2}g, unit: ${unit}; isStable: ${isStable}, impedance: ${impedance}, impedanceEnabled: ${impedanceEnabled}`
          devEvent.emit('data', resultStr)

        }
      })
      hmBle.mstOnServiceChangeBegin(function (param) {
        console.log('----------mstOnServiceChangeBegin')
      })
      hmBle.mstOnServiceChangeEnd(function (param) {
        console.log('----------mstOnServiceChangeEnd')
      })
      createProfile(conParam.connect_id, mac)
    } else {
      console.log('===error connect')
      devEvent.emit('error')
    }

  })
}

export function disConnect(connectId) {
  hmBle.mstDisconnect(connectId)
}

export function offAll() {
  hmBle.mstOffAllCb()
}