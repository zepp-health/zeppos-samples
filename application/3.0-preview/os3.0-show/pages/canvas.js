import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { CANVAS_1, CANVAS_2, CANVAS_BUTTON, CANVAS_TEXT, CANVAS_STYLE_1, CANVAS_STYLE_1_IMG, CANVAS_STYLE_2, CANVAS_STYLE_2_REC_1, CANVAS_STYLE_2_REC_2, CANVAS_STYLE_2_REC_3, CANVAS_STYLE_2_CLEAR_1, CANVAS_STYLE_2_REC_4, CANVAS_STYLE_2_REC_5, CANVAS_STYLE_2_REC_6, CANVAS_STYLE_1_CLEAR_1 } from 'zosLoader:./style.[pf].layout.js'
const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

let canvasIndex0 = null;
let canvasIndex1 = null;
let canvasIndex2 = null;

let animTimer = null;
const logger = log.getLogger('canvas.page')
Page({
  onInit() {
    logger.log("page on init invoke");
  },
  build() {
    //======== 静态，背景+文字 ========
    createCanvas0();
    createCanvas1();
    createCanvas2();
  },
  onHide() {
    logger.log("page on hide invoke");
  },
  onDestroy() {
    logger.log("page on destroy invoke");
  },
});

function createCanvas0() {
  if (canvasIndex0 === null) {
    canvasIndex0 = hmUI.createWidget(hmUI.widget.CANVAS, {
      x: 0,
      y: 0,
      w: DEVICE_WIDTH,
      h: DEVICE_HEIGHT,
    });

    if (canvasIndex0 === null) {
      logger.log("canvasIndex0 create failed");
      return;
    }
  }

  canvasIndex0.drawImage({
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: DEVICE_HEIGHT,
    alpha: 255,
    image: "images/canvas/backg.png",
  });

  canvasIndex0.drawText({
    ...CANVAS_TEXT,
    text: "all in canvas",
  });

  updateButton("images/canvas/start.png");

  canvasIndex0.addEventListener(hmUI.event.CLICK_UP, btnUpCb);
  canvasIndex0.addEventListener(hmUI.event.CLICK_DOWN, btnDnCb);
  canvasIndex0.addEventListener(hmUI.event.MOVE, btnOutCb);
}

function createCanvas1() {
  if (canvasIndex1 === null) {
    canvasIndex1 = hmUI.createWidget(hmUI.widget.CANVAS, CANVAS_STYLE_1);

    if (canvasIndex1 === null) {
      logger.log("canvasIndex1 create failed");
      return;
    }
  }

  canvasIndex1.drawImage({
    ...CANVAS_STYLE_1_IMG,
    image: "images/canvas/anim2/WDF_Animation_1.png",
  });
}

function createCanvas2() {
  if (canvasIndex2 === null) {
    canvasIndex2 = hmUI.createWidget(hmUI.widget.CANVAS, CANVAS_STYLE_2);

    if (canvasIndex2 === null) {
      logger.log("canvasIndex2 create failed");
      return;
    }
  }

  //双圆环绕
  canvasIndex2.drawCircle({
    center_x: CANVAS_1.center_x,
    center_y: CANVAS_1.center_y,
    radius: CANVAS_1.radius,
    color: 0xfff400,
  });

  canvasIndex2.drawCircle({
    center_x: CANVAS_2.center_x,
    center_y: CANVAS_2.center_y,
    radius: CANVAS_2.radius,
    color: 0x1ff4ff,
  });

  //矩形推推
  canvasIndex2.drawFill(CANVAS_STYLE_2_REC_1);
  canvasIndex2.drawFill(CANVAS_STYLE_2_REC_2);
  canvasIndex2.drawFill(CANVAS_STYLE_2_REC_3);
}

let anim = {
  radiusDelta: 0,
  radiusDmax: 0,
  radiusDmin: -12,
  dir: 1,
  dir2: 1,
  rw: 10,
  imgNum: 1,
  posx: 0,
  timerCount: 1,
  animSt: false,
  btnMask: false,
};

function timerCB() {
  anim.timerCount = anim.timerCount + 1;
  if (anim.timerCount === 15) {
    anim.timerCount = 1;
  }

  //===========  矢量图动效  ===========
  if (anim.dir === 0) {
    anim.radiusDelta = anim.radiusDelta + 1;
  } else {
    anim.radiusDelta = anim.radiusDelta - 1;
  }

  if (anim.radiusDelta >= anim.radiusDmax) {
    anim.dir = 1;
  }

  if (anim.radiusDelta <= anim.radiusDmin) {
    anim.dir = 0;
  }

  //TODO 优化
  canvasIndex2.clear(CANVAS_STYLE_2_CLEAR_1);

  canvasIndex2.drawCircle({
    center_x: CANVAS_1.center_x + anim.radiusDelta,
    center_y: CANVAS_1.center_y + anim.radiusDelta,
    radius: CANVAS_1.radius + anim.radiusDelta,
    color: 0xfff400,
  });

  canvasIndex2.drawCircle({
    center_x: CANVAS_2.center_x + anim.radiusDelta,
    center_y: CANVAS_2.center_y + anim.radiusDelta,
    radius: CANVAS_2.radius - anim.radiusDelta,
    color: 0x1ff4ff,
  });

  if (anim.dir2 === 0) {
    anim.rw = anim.rw + 1.67;
  } else {
    anim.rw = anim.rw - 1.67;
  }

  if (anim.rw >= 30) {
    anim.dir2 = 1;
  }

  if (anim.rw <= 10) {
    anim.dir2 = 0;
  }
  canvasIndex2.drawFill({
    ...CANVAS_STYLE_2_REC_4,
    x2: CANVAS_STYLE_2_REC_4.x2 + anim.rw,
  });
  canvasIndex2.drawFill({
    ...CANVAS_STYLE_2_REC_5,
    x1: CANVAS_STYLE_2_REC_5.x1 + anim.rw,
    x2: CANVAS_STYLE_2_REC_5.x2 + anim.rw,
    color: 0xe3a869,
  });
  canvasIndex2.drawFill({
    ...CANVAS_STYLE_2_REC_6,
    x1: CANVAS_STYLE_2_REC_6.x1 +  anim.rw,
  });

  //=================

  canvasIndex1.clear({
    ...CANVAS_STYLE_1_CLEAR_1,
    x: anim.posx,
  });

  anim.imgNum = anim.imgNum + 1;
  anim.posx = anim.posx + 2;
  if (anim.posx === DEVICE_WIDTH) {
    anim.posx = 0;
  }
  if (anim.imgNum === 39) {
    anim.imgNum = 1;
  }

  path2 = `images/canvas/anim2/WDF_Animation_${anim.imgNum}.png`;
  logger.log(path2);
  canvasIndex1.drawImage({
    ...CANVAS_STYLE_1_CLEAR_1,
    x: anim.posx,
    image: path2,
  });
}

function animStart() {
  if (animTimer === null) {
    // animTimer = timer.createTimer(0, 100, timerCB, undefined);
    animTimer = setInterval(timerCB, 100);
  }
}

function animStop() {
  if (animTimer != null) {
    // timer.stopTimer(animTimer);
    clearInterval(animTimer);
    animTimer = null;
  }
}

function isInfoInArea(info, rect) {
  if (
    info.x >= rect.x &&
    info.x <= rect.x + rect.width &&
    info.y >= rect.y &&
    info.y <= rect.y + rect.height
  ) {
    return true;
  } else {
    return false;
  }
}

function updateButton(img) {
  canvasIndex0.drawImage({
    x: CANVAS_BUTTON.x,
    y: CANVAS_BUTTON.y,
    w: CANVAS_BUTTON.width,
    h: CANVAS_BUTTON.height,
    alpha: 255,
    image: img,
  });
}

function btnUpCb(info) {
  if (isInfoInArea(info, CANVAS_BUTTON) === true) {
    anim.animSt = !anim.animSt;

    if (anim.animSt === false) {
      updateButton("images/canvas/start.png");
      animStop();
    } else {
      updateButton("images/canvas/stop.png");
      animStart();
    }

    anim.btnMask = false;
  }
}

function btnDnCb(info) {
  if (isInfoInArea(info, CANVAS_BUTTON) === true) {
    if (anim.animSt === false) {
      updateButton("images/canvas/startMask.png");
    } else {
      updateButton("images/canvas/stopMask.png");
    }

    anim.btnMask = true;
  }
}

function btnOutCb(info) {
  if (isInfoInArea(info, CANVAS_BUTTON) === false && anim.btnMask === true) {
    if (anim.animSt === false) {
      updateButton("images/canvas/start.png");
    } else {
      updateButton("images/canvas/stop.png");
    }

    anim.btnMask = false;
  }
}
