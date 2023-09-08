type Optional<F> = F extends (arg: infer P) => infer R ? (arg?: P) => R : F
type OptionalInterface<T> = { [K in keyof T]: Optional<T[K]> }

interface InstanceMethod {
  sendFile: (path: string, opts: Record<string, string>) => any
  download: (url: string, opts?: Record<string, string>) => any
  httpRequest: <T>(data: {
    url: string
    method: string
    headers?: Record<string, string>
    body?: Record<string, string>
    timeout?: number
  }) => Promise<{
    status: number
    statusText: string
    headers: Record<string, any>
    body: any
  }>

  fetch: <T>(data: {
    url: string
    method: string
    headers?: Record<string, string>
    body?: Record<string, string>
    timeout?: number
  }) => Promise<T>

  request: <T>(data: {
    method: string
    params: Record<string, any>
  }) => Promise<T>

  call: (data: { method: string; params: Record<string, any> }) => void
}

interface CallBackInterface {
  onReceivedFile: (fileObj: any) => void
  onRequest: (
    req: { method: string; params: Record<string, any> },
    res: (error: any, data: any) => void,
  ) => any
  onCall: (data: { method: string; params: Record<string, any> }) => any
  onSettingsChange: (value: {
    key: string
    newValue: any
    oldValue: any
  }) => any
}

type AnyFunction = (options: string) => any
declare module '@zeppos/zml/base-app' {
  type Instance<
    TData extends DataOption,
    TCustom extends CustomOption,
  > = OptionalInterface<ILifeCycle> & Data<TData> & TCustom

  type Options<
    TData extends DataOption,
    TCustom extends CustomOption,
  > = (TCustom & Partial<Data<TData>> & Partial<ILifeCycle>) &
    ThisType<Instance<TData, TCustom>>

  interface ILifeCycle {
    onCreate: AnyFunction
    onDestroy: AnyFunction
  }

  interface Data<D extends DataOption> {
    _options: this
    globalData: D & {
      messaging: any
    }
  }

  type DataOption = Record<string, any>
  type CustomOption = Record<string, any>

  interface Constructor {
    <TData extends DataOption, TCustom extends CustomOption>(
      options: Options<TData, TCustom>,
    ): any
  }

  let BaseApp: Constructor
}

declare module '@zeppos/zml/base-page' {
  type Instance<
    TData extends DataOption,
    TCustom extends CustomOption,
  > = OptionalInterface<ILifeCycle> & Omit<InstanceMethod, 'fetch' | 'download'> & Data<TData> & TCustom

  type Options<
    TData extends DataOption,
    TCustom extends CustomOption,
  > = (TCustom &
    Partial<Data<TData>> &
    Partial<ILifeCycle> &
    Partial<Omit<CallBackInterface, 'onSettingsChange'>>) &
    ThisType<Instance<TData, TCustom>>
  interface ILifeCycle {
    onInit: AnyFunction
    onResume: AnyFunction
    build: AnyFunction
    onPause: AnyFunction
    onDestroy: AnyFunction
  }

  type DataOption = Record<string, any>
  type CustomOption = Record<string, any>

  interface Data<D extends DataOption> {
    _options: this
    state: D
  }

  interface Constructor {
    <TData extends DataOption, TCustom extends CustomOption>(
      options: Options<TData, TCustom>,
    ): any
  }

  let BasePage: Constructor
}

declare module '@zeppos/zml/base-side' {
  type Instance<
    TData extends DataOption,
    TCustom extends CustomOption,
  > = OptionalInterface<ILifeCycle> & Omit<InstanceMethod, 'httpRequest'> & Data<TData> & TCustom

  type Options<
    TData extends DataOption,
    TCustom extends CustomOption,
  > = (TCustom &
    Partial<Data<TData>> &
    Partial<ILifeCycle> &
    Partial<CallBackInterface>) &
    ThisType<Instance<TData, TCustom>>
  interface ILifeCycle {
    onInit: AnyFunction
    onRun: AnyFunction
    onDestroy: AnyFunction
  }

  type DataOption = Record<string, any>
  type CustomOption = Record<string, any>

  interface Data<D extends DataOption> {
    state: D
  }

  interface Constructor {
    <TData extends DataOption, TCustom extends CustomOption>(
      options: Options<TData, TCustom>,
    ): any
  }

  let BaseSideService: Constructor

  interface ISettingsLib {
    getItem(i: string): any
    setItem(i: string, v: any): any
    clear(): void
    removeItem(i: string): void
    getAll(): any
  }

  let settingsLib: ISettingsLib

  interface IConvertLib {
    convert(opts: any): Promise<any>
  }

  let convertLib: IConvertLib
}
