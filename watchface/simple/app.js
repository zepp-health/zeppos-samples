try {
    (() => {
        const __$$app$$__ = __$$hmAppManager$$__.currentApp;
        function getApp() {
            return __$$app$$__.app;
        }
        function getCurrentPage() {
            return __$$app$$__.current && __$$app$$__.current.module;
        }
        __$$app$$__.__globals__ = {
            lang: new DeviceRuntimeCore.HmUtils.Lang(DeviceRuntimeCore.HmUtils.getLanguage()),
            px: DeviceRuntimeCore.HmUtils.getPx(480)
        };
        const {px} = __$$app$$__.__globals__;
        const languageTable = {};
        __$$app$$__.__globals__.gettext = DeviceRuntimeCore.HmUtils.gettextFactory(languageTable, __$$app$$__.__globals__.lang, 'en-US');
        function getGlobal() {
            if (typeof self !== 'undefined') {
                return self;
            }
            if (typeof window !== 'undefined') {
                return window;
            }
            if (typeof global !== 'undefined') {
                return global;
            }
            if (typeof globalThis !== 'undefined') {
                return globalThis;
            }
            throw new Error('unable to locate global object');
        }
        let globalNS$2 = getGlobal();
        if (!globalNS$2.Logger) {
            if (typeof DeviceRuntimeCore !== 'undefined') {
                globalNS$2.Logger = DeviceRuntimeCore.HmLogger;
            }
        }
        let globalNS$1 = getGlobal();
        if (!globalNS$1.Buffer) {
            if (typeof Buffer !== 'undefined') {
                globalNS$1.Buffer = Buffer;
            } else {
                globalNS$1.Buffer = DeviceRuntimeCore.Buffer;
            }
        }
        function isHmTimerDefined() {
            return typeof timer !== 'undefined';
        }
        let globalNS = getGlobal();
        if (typeof setTimeout === 'undefined' && isHmTimerDefined()) {
            globalNS.clearTimeout = function clearTimeout(timerRef) {
                timerRef && timer.stopTimer(timerRef);
            };
            globalNS.setTimeout = function setTimeout2(func, ns) {
                const timer1 = timer.createTimer(ns || 1, Number.MAX_SAFE_INTEGER, function () {
                    globalNS.clearTimeout(timer1);
                    func && func();
                }, {});
                return timer1;
            };
            globalNS.clearImmediate = function clearImmediate(timerRef) {
                timerRef && timer.stopTimer(timerRef);
            };
            globalNS.setImmediate = function setImmediate(func) {
                const timer1 = timer.createTimer(1, Number.MAX_SAFE_INTEGER, function () {
                    globalNS.clearImmediate(timer1);
                    func && func();
                }, {});
                return timer1;
            };
            globalNS.clearInterval = function clearInterval(timerRef) {
                timerRef && timer.stopTimer(timerRef);
            };
            globalNS.setInterval = function setInterval(func, ms) {
                const timer1 = timer.createTimer(1, ms, function () {
                    func && func();
                }, {});
                return timer1;
            };
        }
        __$$app$$__.app = DeviceRuntimeCore.App({
            globalData: {},
            onCreate(options) {
            },
            onDestroy(options) {
            },
            onError(error) {
            },
            onPageNotFound(obj) {
            },
            onUnhandledRejection(obj) {
            }
        });
        ;
    })();
} catch (e) {
    console.log('Mini Program Error', e);
    e && e.stack && e.stack.split(/\n/).forEach(i => console.log('error stack', i));
    ;
}