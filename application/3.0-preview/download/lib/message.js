const shakeTimeout = 5000;
const requestTimeout = 60000;

export function wrapperMessage(messageBuilder, logger, isZeppOS = false) {
  return {
    shakeTimeout,
    requestTimeout,
    onCall(cb) {
      if (!cb) return this;
      messageBuilder.on("call", ({ payload }) => {
        const jsonRpc = messageBuilder.buf2Json(payload);
        cb && cb(jsonRpc);
      });

      return this;
    },
    offOnCall(cb) {
      messageBuilder.off("call", cb);
      return this;
    },
    call(data) {
      isZeppOS && messageBuilder.fork(this.shakeTimeout);
      return messageBuilder.call({
        jsonrpc: "hmrpcv1",
        ...data,
      });
    },
    onRequest(cb) {
      if (!cb) return this;
      messageBuilder.on("request", (ctx) => {
        const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
        cb &&
          cb(jsonRpc, (error, data) => {
            if (error) {
              return ctx.response({
                data: {
                  error,
                },
              });
            }

            logger.log("==== ON REQUEST ====", ctx, data);
            return ctx.response({
              data: {
                result: data,
              },
            });
          });
      });

      return this;
    },
    cancelAllRequest() {
      messageBuilder.off("response");
      return this;
    },
    offOnRequest(cb) {
      messageBuilder.off("request", cb);
      return this;
    },
    request(data, { timeout = 60000 } = {}) {
      isZeppOS && messageBuilder.fork(this.shakeTimeout);
      logger.debug(
        "current request count=>%d",
        messageBuilder.getRequestCount()
      );
      return messageBuilder
        .request(
          {
            jsonrpc: "hmrpcv1",
            ...data,
          },
          {
            timeout: timeout || this.requestTimeout,
          }
        )
        .then(({ error, result }) => {
          if (error) {
            throw error;
          }

          return result;
        });
    },
    // device function
    connect() {
      messageBuilder.connect(() => {
        logger.debug("DeviceApp messageBuilder connect with SideService");
      });
      return this;
    },
    disConnect() {
      this.offOnRequest();
      this.offOnCall();
      messageBuilder.disConnect(() => {
        logger.debug("DeviceApp messageBuilder disconnect SideService");
      });
      return this;
    },
    // app-side function
    start() {
      messageBuilder.listen(() => {
        logger.debug("SideService messageBuilder start to listen to DeviceApp");
      });
      return this;
    },
    stop() {
      messageBuilder.disConnect(() => {
        logger.debug("SideService messageBuilder stop to listen to DeviceApp");
      });
      return this;
    },
  };
}
