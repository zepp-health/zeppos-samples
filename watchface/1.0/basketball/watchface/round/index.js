let rootPath = null
let bgPath = null
let iconPath = null
let numberPath = null
let time1Path = null
let time2Path = null
let iconArray = null
let numberArray = null
let time1Array = null
let time2Array = null

const logger = Logger.getLogger('basketball-page')

const img = (function (type) {
  return (path) => type + '/' + path
})('images')


function range(start, end, step = 1) {
  if (arguments.length === 1) {
    end = start
    start = 0
    step = 1
  }

  const result = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }

  return result
}

WatchFace({
  _animNext() {
    animResident.setProperty(hmUI.prop.ANIM_STATUS, 1)
    animCreate.setProperty(hmUI.prop.VISIBLE, false)
  },

  initView() {
    iconArray = range(6).map((v) => {
      return img(`icon/${v}.png`)
    })
    numberArray = range(10).map((v) => {
      return img(`number/${v}.png`)
    })
    time1Array = range(10).map((v) => {
      return img(`time01/${v}.png`)
    })
    time2Array = range(10).map((v) => {
      return img(`time02/${v}.png`)
    })

    hmUI.createWidget(hmUI.widget.IMG, {
      x: px(0),
      y: px(0),
      w: px(454),
      h: px(454),
      src: img('bg/bg.png'),
      show_level: hmUI.show_level.ONLY_NORMAL,
    })

    let animA = hmUI.createWidget(hmUI.widget.IMG_ANIM, {
      x: px(0),
      y: px(0),
      anim_path: img('bg'),
      anim_prefix: 'a',
      anim_ext: 'png',
      anim_fps: 25,
      anim_size: 23,
      repeat_count: 1,
      anim_repeat: false,
      anim_status: hmUI.anim_status.START,
      display_on_restart: false,
    })

    function startTime() {
      timer.createTimer(3000, 10000, () => {
        animA.setProperty(hmUI.prop.ANIM_STATUS, hmUI.anim_status.START)
      })
    }

    hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
      x: px(63),
      y: px(278),
      image_array: iconArray,
      image_length: iconArray.length,
      type: hmUI.data_type.BATTERY,
      show_level: hmUI.show_level.ONLY_NORMAL,
    })

    hmUI.createWidget(hmUI.widget.TEXT_IMG, {
      x: px(85),
      y: px(277),
      type: hmUI.data_type.BATTERY,
      font_array: numberArray,
      h_space: 0,
      align_h: hmUI.align.LEFT,
      invalid_image: img('number/null.png'),
      unit_en: img('number/baifen.png'),
      unit_sc: img('number/baifen.png'),
      unit_tc: img('number/baifen.png'),
      show_level: hmUI.show_level.ONLY_NORMAL,
    })

    hmUI.createWidget(hmUI.widget.TEXT_IMG, {
      x: px(373),
      y: px(192),
      type: hmUI.data_type.HEART,
      font_array: numberArray,
      h_space: -3,
      align_h: hmUI.align.LEFT,
      invalid_image: img('number/null.png'),
      show_level: hmUI.show_level.ONLY_NORMAL,
    })

    hmUI.createWidget(hmUI.widget.IMG_TIME, {
      hour_zero: 1,
      hour_startX: px(89),
      hour_startY: px(50),
      hour_array: time1Array,
      hour_space: 0,
      minute_zero: 1,
      minute_startX: px(243),
      minute_startY: px(50),
      minute_array: time1Array,
      minute_space: 0,
      show_level: hmUI.show_level.ONLY_NORMAL,
    })

    hmUI.createWidget(hmUI.widget.IMG_TIME, {
      hour_zero: 1,
      hour_startX: px(89),
      hour_startY: px(50),
      hour_array: time2Array,
      hour_space: 0,
      minute_zero: 1,
      minute_startX: px(243),
      minute_startY: px(50),
      minute_array: time2Array,
      minute_space: 0,
      show_level: hmUI.show_level.ONAL_AOD,
    })

    hmUI.createWidget(hmUI.widget.IMG, {
      x: px(219),
      y: px(50),
      src: img('time01/maohao.png'),
      show_level: hmUI.show_level.ONLY_NORMAL,
    })

    hmUI.createWidget(hmUI.widget.IMG, {
      x: px(219),
      y: px(50),
      src: img('time02/maohao.png'),
      show_level: hmUI.show_level.ONAL_AOD,
    })

    hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
      resume_call: function () {
        startTime()
      },
      pause_call: function () {
        timer.stopTimer(anim_time)
        logger.log('ui pause')
      },
    })
  },

  onInit() {
    logger.log('index page.js on init invoke')
  },

  build() {
    logger.log('index page.js on build invoke')
    this.initView()
  },

  onDestroy() {
    logger.log('index page.js on destroy invoke')
  },
})
