import { getDeviceInfo } from "@zos/device";
import hmUI from "@zos/ui";
import { log } from "@zos/utils";

const { height: DEVICE_HEIGHT, width: DEVICE_WIDTH } = getDeviceInfo();

let canvasIndex0 = null;
let canvasIndex1 = null;
let canvasIndex2 = null;

let circleA = {
  center_x: 24,
  center_y: 104,
  radius: 24,
};

let circleB = {
  center_x: 51,
  center_y: 131,
  radius: 12,
};

let button = {
  x: (DEVICE_WIDTH - 300) / 2,
  y: 330,
  width: 300,
  height: 105,
};

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
    x: 120,
    y: 30,
    text_size: 40,
    text: "all in canvas",
  });

  updateButton("images/canvas/start.png");

  canvasIndex0.addEventListener(hmUI.event.CLICK_UP, btnUpCb);
  canvasIndex0.addEventListener(hmUI.event.CLICK_DOWN, btnDnCb);
  canvasIndex0.addEventListener(hmUI.event.MOVE, btnOutCb);
}

function createCanvas1() {
  if (canvasIndex1 === null) {
    canvasIndex1 = hmUI.createWidget(hmUI.widget.CANVAS, {
      x: 0,
      y: 180,
      w: DEVICE_WIDTH,
      h: 64,
    });

    if (canvasIndex1 === null) {
      logger.log("canvasIndex1 create failed");
      return;
    }
  }

  canvasIndex1.drawImage({
    x: 0,
    y: 0,
    w: 64,
    h: 64,
    alpha: 255,
    image: "images/canvas/anim2/WDF_Animation_1.png",
  });
}

function createCanvas2() {
  if (canvasIndex2 === null) {
    canvasIndex2 = hmUI.createWidget(hmUI.widget.CANVAS, {
      x: 100,
      y: 100,
      w: DEVICE_WIDTH - 200,
      h: 200,
    });

    if (canvasIndex2 === null) {
      logger.log("canvasIndex2 create failed");
      return;
    }
  }

  //双圆环绕
  canvasIndex2.drawCircle({
    center_x: circleA.center_x,
    center_y: circleA.center_y,
    radius: circleA.radius,
    color: 0xfff400,
  });

  canvasIndex2.drawCircle({
    center_x: circleB.center_x,
    center_y: circleB.center_y,
    radius: circleB.radius,
    color: 0x1ff4ff,
  });

  //矩形推推
  canvasIndex2.drawFill({
    x1: 150,
    y1: 80,
    x2: 170,
    y2: 143,
    color: 0xe3a869,
  });
  canvasIndex2.drawFill({
    x1: 180,
    y1: 80,
    x2: 220,
    y2: 143,
    color: 0xe3a869,
  });
  canvasIndex2.drawFill({
    x1: 230,
    y1: 80,
    x2: 250,
    y2: 143,
    color: 0xe3a869,
  });
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
  canvasIndex2.clear({
    x: 0,
    y: 0,
    w: DEVICE_WIDTH - 200,
    h: DEVICE_HEIGHT - 100,
  });

  canvasIndex2.drawCircle({
    center_x: circleA.center_x + anim.radiusDelta,
    center_y: circleA.center_y + anim.radiusDelta,
    radius: circleA.radius + anim.radiusDelta,
    color: 0xfff400,
  });

  canvasIndex2.drawCircle({
    center_x: circleB.center_x + anim.radiusDelta,
    center_y: circleB.center_y + anim.radiusDelta,
    radius: circleB.radius - anim.radiusDelta,
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
    x1: 150,
    y1: 80,
    x2: 150 + anim.rw,
    y2: 143,
    color: 0xe3a869,
  });
  canvasIndex2.drawFill({
    x1: 160 + anim.rw,
    y1: 80,
    x2: 240 - (40 - anim.rw),
    y2: 143,
    color: 0xe3a869,
  });
  canvasIndex2.drawFill({
    x1: 250 - (40 - anim.rw),
    y1: 80,
    x2: 250,
    y2: 143,
    color: 0xe3a869,
  });

  //=================

  canvasIndex1.clear({
    x: anim.posx,
    y: 0,
    w: 64,
    h: 64,
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
    x: anim.posx,
    y: 0,
    w: 64,
    h: 64,
    alpha: 255,
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
    x: button.x,
    y: button.y,
    w: button.width,
    h: button.height,
    alpha: 255,
    image: img,
  });
}

function btnUpCb(info) {
  if (isInfoInArea(info, button) === true) {
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
  if (isInfoInArea(info, button) === true) {
    if (anim.animSt === false) {
      updateButton("images/canvas/startMask.png");
    } else {
      updateButton("images/canvas/stopMask.png");
    }

    anim.btnMask = true;
  }
}

function btnOutCb(info) {
  if (isInfoInArea(info, button) === false && anim.btnMask === true) {
    if (anim.animSt === false) {
      updateButton("images/canvas/start.png");
    } else {
      updateButton("images/canvas/stop.png");
    }

    anim.btnMask = false;
  }
}
