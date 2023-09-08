# ZML

一个为 Zepp OS 小程序的开发迷你开发库。目前集成了网络请求,通信等功能。

## 使用

### httpRequest API

直接使用 http 请求

#### app.js 中使用

```javascript
import { BaseApp } from '@zeppos/zml/base-app'

App(
  BaseApp({
    globalData: {},
    onCreate() {},
    onDestroy(opts) {},
  }),
)
```

#### page 模块中使用

```javascript
import { BasePage } from '@zeppos/zml/base-page'
Page(
  BasePage({
    state: {},
    build() {},

    onInit() {
      this.getYourData()
    },

    getYourData() {
      return this.httpRequest({
        method: 'get',
        url: 'you url',
      })
        .then((result) => {
          console.log('result.status', result.status)
          console.log('result.statusText', result.statusText)
          console.log('result.headers', result.headers)
          console.log('result.body', result.body)
        })
        .catch((error) => {
          console.error('error=>', error)
        })
    },
    onDestroy() {
      console.log('page onDestroy invoked')
    },
  }),
)
```

#### sideService 模块中使用

```javascript
import { BaseSideService } from '@zeppos/zml/base-side'

AppSideService(BaseSideService())
```

查看 [helloworld1](./examples/helloworld1/)

### request APIs

跟手机通信相关api

1. 使用 request, call 发送数据
2. 使用 onRequest, onCall 接受数据

#### app.js 中使用

```javascript
import { BaseApp } from '@zeppos/zml/base-app'

App(
  BaseApp({
    globalData: {},
    onCreate() {},
    onDestroy() {},
  }),
)
```

#### page 模块中使用

```javascript
import { BasePage } from '@zeppos/zml/base-page'
Page(
  BasePage({
    build() {},

    onInit() {
      this.getDataFromMobile()
    },

    getDataFromMobile() {
      return this.request({
        method: 'your.method1',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
        .then((result) => {
          // receive your data
          console.log('result=>', result)
        })
        .catch((error) => {
          // receive your error
          console.error('error=>', error)
        })
    },

    notifyMobile() {
      this.call({
        method: 'your.method3',
        params: {
          param1: 'param1',
          param2: 'param2',
        },
      })
    },

    onRequest(req, res) {
      // need reply
      // node style callback
      // first param is error
      // second param is your data
      if (req.method === 'your.method2') {
        // do something
        console.log('req=>', JSON.string(req))
        res(null, {
          test: 1,
        })
      } else {
        res('error happened')
      }
    },

    onCall(data) {
     // no reply
     if (req.method === 'your.method4') {
       // do something
       console.log('req=>', JSON.string(data))
     }
    },

    onDestroy() {
      console.log('page onDestroy invoked')
    },
  }),
)
```

#### sideService 模块中使用

```javascript
import { BaseSideService } from '@zeppos/zml/base-side'

AppSideService(
  BaseSideService({
    onInit() {

    },
    onRun() {

    },
    getDataFromDevice() {
      return this.request({
        method: 'your.method2',
        params: {
          param1: 'param1',
          param2: 'param2'
        }
      })
        .then((result) => {
          // receive your data
          console.log('result=>', result)
        })
        .catch((error) => {
          // receive your error
          console.error('error=>', error)
        })
    },

    notifyDevice() {
      this.call({
        method: 'your.method4',
        params: {
          param1: 'param1',
          param2: 'param2'
        }
      })
    },

    onRequest(req, res) {
      // need reply
      // node style callback
      // first param is error
      // second param is your data
      if (req.method === 'your.method1') {
        // do something
        res(null, {
          test: 1
        })
      } else {
        res('error happened')
      }
    },

    onCall(data) {
      onCall(data) {
      // no reply
      if (req.method === 'your.method3') {
        // do something
      }
    },

    },
    onDestroy() {

    }
  }),
)
```

查看 [helloworld2](./examples/helloworld2/)


### 更复杂的例子

查看 [helloworld3](./examples/helloworld3/)