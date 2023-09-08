# ZML

[中文版 README](./README_CN.md)

A mini development library for Zepp OS mini programs. Currently integrates network requests, communication and other functions.

## Usage

### httpRequest API

Use http requests directly

#### Use in app.js

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

#### Use in page module

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

#### Use in sideService module

```javascript
import { BaseSideService } from '@zeppos/zml/base-side'

AppSideService(BaseSideService())
```

See [helloworld1](./examples/helloworld1/)

### request APIs

APIs related to communication with the phone

1. Use request, call to send data
2. Use onRequest, onCall to receive data

#### Use in app.js

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

#### Use in page module

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

#### Use in sideService module

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
See [helloworld2](./examples/helloworld2/)


### More complex example

See [helloworld3](./examples/helloworld3/)