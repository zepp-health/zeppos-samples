const logger = Logger.getLogger('color-world-page')

const ROOTPATH = 'images/'

const numberPath = ROOTPATH + 'number/'
const timePath = ROOTPATH + 'time/'
const numPath = ROOTPATH + 'num/'
const weekENPath = ROOTPATH + 'weekEN/'
const weekSCPath = ROOTPATH + 'weekSC/'
const weekTCPath = ROOTPATH + 'weekTC/'
const icPath = ROOTPATH + 'icon/'
const XicPath = ROOTPATH + 'xicon/'
const heartPath = ROOTPATH + 'heart/'
const UVIPath = ROOTPATH + 'UVI/'
const weatherPath = ROOTPATH + 'weather/'
const moonPath = ROOTPATH + 'moon/'

const numArray = [
  numPath + '0.png',
  numPath + '1.png',
  numPath + '2.png',
  numPath + '3.png',
  numPath + '4.png',
  numPath + '5.png',
  numPath + '6.png',
  numPath + '7.png',
  numPath + '8.png',
  numPath + '9.png',
]

const weatherArray = [
  weatherPath + '0.png',
  weatherPath + '1.png',
  weatherPath + '2.png',
  weatherPath + '3.png',
  weatherPath + '4.png',
  weatherPath + '5.png',
  weatherPath + '6.png',
  weatherPath + '7.png',
  weatherPath + '8.png',
  weatherPath + '9.png',
  weatherPath + '10.png',
  weatherPath + '11.png',
  weatherPath + '12.png',
  weatherPath + '13.png',
  weatherPath + '14.png',
  weatherPath + '15.png',
  weatherPath + '16.png',
  weatherPath + '17.png',
  weatherPath + '18.png',
  weatherPath + '19.png',
  weatherPath + '20.png',
  weatherPath + '21.png',
  weatherPath + '22.png',
  weatherPath + '23.png',
  weatherPath + '24.png',
  weatherPath + '25.png',
  weatherPath + '26.png',
  weatherPath + '27.png',
  weatherPath + '28.png',
]
const moonArray = [
  moonPath + '1.png',
  moonPath + '2.png',
  moonPath + '3.png',
  moonPath + '4.png',
  moonPath + '5.png',
  moonPath + '6.png',
  moonPath + '7.png',
  moonPath + '8.png',
  moonPath + '9.png',
  moonPath + '10.png',
  moonPath + '11.png',
  moonPath + '12.png',
  moonPath + '13.png',
  moonPath + '14.png',
  moonPath + '15.png',
  moonPath + '16.png',
  moonPath + '17.png',
  moonPath + '18.png',
  moonPath + '19.png',
  moonPath + '20.png',
  moonPath + '21.png',
  moonPath + '22.png',
  moonPath + '23.png',
  moonPath + '24.png',
  moonPath + '25.png',
  moonPath + '26.png',
  moonPath + '27.png',
  moonPath + '28.png',
  moonPath + '29.png',
]
const heartArray = [
  heartPath + '1.png',
  heartPath + '2.png',
  heartPath + '3.png',
  heartPath + '4.png',
  heartPath + '5.png',
  heartPath + '6.png',
]
const uviArray = [
  UVIPath + '1.png',
  UVIPath + '2.png',
  UVIPath + '3.png',
  UVIPath + '4.png',
  UVIPath + '5.png',
]

const weekEnArray = [
  weekENPath + '1.png',
  weekENPath + '2.png',
  weekENPath + '3.png',
  weekENPath + '4.png',
  weekENPath + '5.png',
  weekENPath + '6.png',
  weekENPath + '7.png',
]

const weekScArray = [
  weekSCPath + '1.png',
  weekSCPath + '2.png',
  weekSCPath + '3.png',
  weekSCPath + '4.png',
  weekSCPath + '5.png',
  weekSCPath + '6.png',
  weekSCPath + '7.png',
]

const weekTcArray = [
  weekTCPath + '1.png',
  weekTCPath + '2.png',
  weekTCPath + '3.png',
  weekTCPath + '4.png',
  weekTCPath + '5.png',
  weekTCPath + '6.png',
  weekTCPath + '7.png',
]

WatchFace({
  drawWidget(editType, id) {
    let config = {
      bgx: null,
      bgy: null,
      w: null,
      iconX: null,
      iconY: null,
      numX: null,
      numY: null,
      bgImg: null,
      array: null,
      type: null,
      src: null,
      numArray: null,
      h: 0,
      invalid: null,
      align: null,
      unitEn: null,
      unitSc: null,
      unitTc: null,
      spPath: null,
      negative: null,
      color: null,
      cl: null,
      id: null,
    }
    switch (id) {
      case 101:
        config.bgx = 153
        config.bgy = 262
        config.bgw = 92
        config.numX = 149
        config.numY = 288
        config.iconX = 179
        config.iconY = 312
        break
      default:
        return
    }

    switch (editType) {
      case hmUI.edit_type.STEP:
        config.id = 103
        config.iconPath = XicPath + 'step.png'
        config.dataType = hmUI.data_type.STEP
        config.numArray = numArray
        config.bgImg = 'images/iconbg/step.png'
        config.cl = 0x06a5ff
        break
      case hmUI.edit_type.CAL:
        config.id = 103
        config.iconPath = XicPath + 'kcal.png'
        config.dataType = hmUI.data_type.CAL
        config.numArray = numArray
        config.bgImg = 'images/iconbg/cal.png'
        config.cl = 0xdf4f26
        break
      case hmUI.edit_type.PAI:
        config.id = 103
        config.iconPath = XicPath + 'Pai.png'
        config.dataType = hmUI.data_type.PAI_WEEKLY
        config.numArray = numArray
        config.bgImg = 'images/iconbg/pai.png'
        config.cl = 0xd612c0
        break
      case hmUI.edit_type.DISTANCE:
        config.id = 104
        config.iconPath = XicPath + 'dis.png'
        config.dataType = hmUI.data_type.DISTANCE
        config.numArray = numArray
        config.spPath = 'images/num/dian.png'
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/dis.png'
        break
      case hmUI.edit_type.HEART:
        config.id = 102
        config.array = heartArray
        config.iconPath = XicPath + 'heart.png'
        config.dataType = hmUI.data_type.HEART
        config.numArray = numArray
        config.invalid = 'images/num/none.png'
        break
      case hmUI.edit_type.BATTERY:
        config.id = 103
        config.iconPath = XicPath + 'bat.png'
        config.dataType = hmUI.data_type.BATTERY
        config.numArray = numArray
        config.bgImg = 'images/iconbg/bat.png'
        config.cl = 0x06c18a
        break
      case hmUI.edit_type.SLEEP:
        config.id = 104
        config.iconPath = XicPath + 'sleep.png'
        config.dataType = hmUI.data_type.SLEEP
        config.numArray = numArray
        config.spPath = 'images/num/dian.png'
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/sleep.png'
        break
      case hmUI.edit_type.SPO2:
        config.id = 105
        config.iconPath = XicPath + 'spo2.png'
        config.dataType = hmUI.data_type.SPO2
        config.numArray = numArray
        config.unitEn = 'images/num/baifenhao.png'
        config.unitSc = 'images/num/baifenhao.png'
        config.unitTc = 'images/num/baifenhao.png'
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/spo2.png'
        break
      case hmUI.edit_type.STAND:
        config.id = 103
        config.iconPath = XicPath + 'stand.png'
        config.dataType = hmUI.data_type.STAND
        config.numArray = numArray
        config.spPath = 'images/num/fenhao.png'
        config.bgImg = 'images/iconbg/step.png'
        config.cl = 0x06a5ff
        break
      case hmUI.edit_type.STRESS:
        config.id = 104
        config.iconPath = XicPath + 'pressure.png'
        config.dataType = hmUI.data_type.STRESS
        config.numArray = numArray
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/kpa.png'

        break
      case hmUI.edit_type.TEMPERATURE:
        config.id = 109
        config.iconPath = XicPath + 'T.png'
        config.dataType = hmUI.data_type.WEATHER_CURRENT
        config.numArray = numArray
        config.unitEn = 'images/num/du.png'
        config.unitSc = 'images/num/du.png'
        config.unitTc = 'images/num/du.png'
        config.negative = 'images/num/fuhao.ng'
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/t.png'
        break
      case hmUI.edit_type.UVI:
        config.id = 108
        config.array = uviArray
        config.flag = true
        config.iconPath = XicPath + 'UVI.png'
        config.dataType = hmUI.data_type.UVI
        config.numArray = numArray
        config.invalid = 'images/num/none.png'
        break
      case hmUI.edit_type.WEATHER:
        config.id = 107
        config.bgImg = 'images/iconbg/weather.png'
        config.dataType = hmUI.data_type.WEATHER_CURRENT
        config.numArray = numArray
        config.invalid = 'images/num/wnone.png'
        config.negative = 'images/num/fushu.ng'
        config.unitEn = 'images/num/du.png'
        config.unitSc = 'images/num/du.png'
        config.unitTc = 'images/num/du.png'

        break
      case hmUI.edit_type.WIND:
        config.id = 105
        config.iconPath = XicPath + 'wind.png'
        config.dataType = hmUI.data_type.WIND
        config.numArray = numArray
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/wind.png'
        break

      case hmUI.edit_type.FAT_BURN:
        config.id = 104
        config.iconPath = XicPath + 'sport.png'
        config.dataType = hmUI.data_type.FAT_BURN
        config.numArray = numArray
        config.spPath = 'images/num/dian.png'
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/sport.png'
        break
      case hmUI.edit_type.ALTIMETER:
        config.id = 104
        config.iconPath = XicPath + 'Kpa.png'
        config.dataType = hmUI.data_type.ALTIMETER
        config.numArray = numArray
        config.invalid = 'images/num/none.png'
        config.bgImg = 'images/iconbg/kpa.png'
        break
      case hmUI.edit_type.MOON:
        config.id = 106
        config.iconPath = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
          x: 156,
          y: 275,
          image_array: moonArray,
          image_length: moonArray.length,
          type: hmUI.data_type.MOON,
          show_level: hmUI.show_level.ONLY_NORMAL,
        })
        config.dataType = hmUI.data_type.MOON
        config.numArray = numArray
        break

      default:
        return config
    }

    function iconText() {
      hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        x: config.numX + 1,
        y: config.numY,
        w: config.bgw,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: hmUI.align.CENTER_H,
        show_level: hmUI.show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        dot_image: config.spPath,
        negative_image: config.negative,
      })

      hmUI.createWidget(hmUI.widget.IMG, {
        x: config.iconX,
        y: config.iconY + 2,
        src: config.iconPath,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })
    }

    function tIconText() {
      hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        x: config.numX + 1,
        y: config.numY,
        w: config.bgw,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: hmUI.align.CENTER_H,
        show_level: hmUI.show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        negative_image: config.negative,
      })

      hmUI.createWidget(hmUI.widget.IMG, {
        x: config.iconX,
        y: config.iconY + 2,
        src: config.iconPath,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })
    }

    if (config.id == 102) {
      hmUI.createWidget(hmUI.widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        alpha: 255,
        src: 'images/heart/heart0.png',
      })

      hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
        x: config.bgx,
        y: config.bgy,
        image_array: config.array,
        image_length: config.array.length,
        type: config.dataType,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      iconText()
    }
    if (config.id == 108) {
      hmUI.createWidget(hmUI.widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        alpha: 255,
        src: 'images/UVI/uvi0.png',
      })
      hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
        x: config.bgx,
        y: config.bgy,
        image_array: config.array,
        image_length: config.array.length,
        type: config.dataType,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      iconText()
    }

    if (config.id == 103) {
      itemBgImg = hmUI.createWidget(hmUI.widget.IMG, {
        x: config.bgx,
        y: config.bgy - 1,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      hmUI.createWidget(hmUI.widget.ARC_PROGRESS, {
        x: 0,
        y: 0,
        w: 92,
        h: 92,
        center_x: config.bgx + 42,
        center_y: config.bgy + 42,
        radius: 35,
        start_angle: -139,
        end_angle: 139,
        line_width: 8,
        color: config.cl,
        type: config.dataType,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      iconText()

      if (editType == hmUI.edit_type.STAND) {
        hmUI.createWidget(hmUI.widget.IMG, {
          x: config.numX + 50,
          y: config.numY + 3,
          w: 25,
          h: 18,
          alpha: 156,
          src: 'images/mask/zezhao2.png',
        })
      }
    }
    if (config.id == 104) {
      itemBgImg = hmUI.createWidget(hmUI.widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        x: 150,
        y: 310,
        w: 92,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: hmUI.align.CENTER_H,
        show_level: hmUI.show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        dot_image: config.spPath,
        negative_image: config.negative,
      })

      hmUI.createWidget(hmUI.widget.IMG, {
        x: 180,
        y: 275,
        src: config.iconPath,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })
    }

    if (config.id == 105 || config.id == 109) {
      itemBgImg = hmUI.createWidget(hmUI.widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      hmUI.createWidget(hmUI.widget.IMG_POINTER, {
        src: 'images/num/p.png',
        center_x: 194.2,
        center_y: 304,
        x: 6,
        y: 40,
        type: config.dataType,
        start_angle: -135,
        end_angle: 135,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })
      if (config.id == 109) {
        tIconText()
      } else {
        iconText()
      }
    }
    if (config.id == 106) {
      iconText()
    }
    if (config.id == 107) {
      itemBgImg = hmUI.createWidget(hmUI.widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: hmUI.show_level.ONLY_NORMAL,
      })

      hmUI.createWidget(hmUI.widget.TEXT_IMG, {
        x: 150,
        y: 310,
        w: 92,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: hmUI.align.CENTER_H,
        show_level: hmUI.show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        negative_image: config.negative,
      })

      hmUI.createWidget(hmUI.widget.IMG, {
        x: 180,
        y: 275,
        src: hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
          x: 178,
          y: 275,
          image_array: weatherArray,
          image_length: weatherArray.length,
          type: hmUI.data_type.WEATHER,
          show_level: hmUI.show_level.ONLY_NORMAL,
        }),
        show_level: hmUI.show_level.ONLY_NORMAL,
      })
    }
  },
  initView() {
    let editBg = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_BG, {
      edit_id: 123,
      x: 0,
      y: 0,
      bg_config: [
        {
          id: 1,
          preview: ROOTPATH + 'clbg/BG1.png',
          path: ROOTPATH + 'clbg/BG1.png',
        },
        {
          id: 2,
          preview: ROOTPATH + 'clbg/BG2.png',
          path: ROOTPATH + 'clbg/BG2.png',
        },
        {
          id: 3,
          preview: ROOTPATH + 'clbg/BG3.png',
          path: ROOTPATH + 'clbg/BG3.png',
        },
      ],
      count: 3,
      default_id: 1,
      fg: ROOTPATH + 'edit/mask.png',
      tips_x: 132,
      tips_y: 400,
      tips_bg: ROOTPATH + 'edit/tips.png',
    })

    let type = editBg.getProperty(hmUI.prop.CURRENT_TYPE)
    let mainBgOptions = {
      x: 0,
      y: 0,
      w: 390,
      h: 450,
      show_level: hmUI.show_level.ONAL_AOD,
    }

    switch (type) {
      case 1:
        Object.assign(mainBgOptions, { src: ROOTPATH + 'xpbg/BG1.png' })
        break
      case 2:
        Object.assign(mainBgOptions, { src: ROOTPATH + 'xpbg/BG2.png' })
        break
      case 3:
        Object.assign(mainBgOptions, { src: ROOTPATH + 'xpbg/BG3.png' })
        break
      default:
        break
    }

    hmUI.createWidget(hmUI.widget.IMG, mainBgOptions)

    hmUI.createWidget(hmUI.widget.IMG_WEEK, {
      x: 155,
      y: 96,
      week_en: weekEnArray,
      week_tc: weekTcArray,
      week_sc: weekScArray,
      show_level: hmUI.show_level.ONLY_NORMAL | hmUI.show_level.ONAL_AOD,
    })

    let widgetOptionalArray = [
      {
        type: hmUI.edit_type.STEP,
        preview: 'images/icon/step.png',
      },
      {
        type: hmUI.edit_type.CAL,
        preview: 'images/icon/kcal.png',
      },
      {
        type: hmUI.edit_type.BATTERY,
        preview: 'images/icon/bat.png',
      },
      {
        type: hmUI.edit_type.HEART,
        preview: 'images/icon/heart.png',
      },
      {
        type: hmUI.edit_type.UVI,
        preview: 'images/icon/UVI.png',
      },
      {
        type: hmUI.edit_type.PAI,
        preview: 'images/icon/Pai.png',
      },
      {
        type: hmUI.edit_type.DISTANCE,
        preview: 'images/icon/dis.png',
      },
      {
        type: hmUI.edit_type.STAND,
        preview: 'images/icon/stand.png',
      },
      {
        type: hmUI.edit_type.SPO2,
        preview: 'images/icon/spo2.png',
      },
      {
        type: hmUI.edit_type.STRESS,
        preview: 'images/icon/pressure.png',
      },
      {
        type: hmUI.edit_type.SLEEP,
        preview: 'images/icon/sleep.png',
      },
      {
        type: hmUI.edit_type.WIND,
        preview: 'images/icon/wind.png',
      },
      {
        type: hmUI.edit_type.WEATHER,
        preview: 'images/icon/weather.png',
      },
      {
        type: hmUI.edit_type.TEMPERATURE,
        preview: 'images/icon/T.png',
      },
      {
        type: hmUI.edit_type.FAT_BURN,
        preview: 'images/icon/sport.png',
      },
      {
        type: hmUI.edit_type.ALTIMETER,
        preview: 'images/icon/Kpa.png',
      },
      {
        type: hmUI.edit_type.MOON,
        preview: 'images/icon/moon.png',
      },
    ]

    let editGroup = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_GROUP, {
      edit_id: 101,
      x: 149,
      y: 266,
      w: 92,
      h: 92,
      select_image: 'images/edit/select.png',
      un_select_image: 'images/edit/select.png',
      default_type: hmUI.edit_type.MOON,
      optional_types: widgetOptionalArray,
      count: widgetOptionalArray.length,
      tips_BG: 'images/edit/tips.png',
      tips_x: -16,
      tips_y: 100,
      tips_width: 124,
    })

    let item = editGroup.getProperty(hmUI.prop.CURRENT_TYPE)
    this.drawWidget(item, 101)

    const centerXValue = 195
    const centerYValue = 225
    const pointerConfig = [
      {
        id: 1,
        hour: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 20,
          posY: 224,
          path: ROOTPATH + 'pointer1/H.png',
        },
        minute: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 17,
          posY: 224,
          path: ROOTPATH + 'pointer1/M.png',
        },
        second: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 11,
          posY: 224,
          path: ROOTPATH + 'pointer1/S.png',
        },
        preview: ROOTPATH + 'yulantu/1.png',
      },
      {
        id: 2,
        hour: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 26,
          posY: 224,
          path: ROOTPATH + 'pointer2/H.png',
        },
        minute: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 23,
          posY: 224,
          path: ROOTPATH + 'pointer2/M.png',
        },
        second: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 12,
          posY: 224,
          path: ROOTPATH + 'pointer2/S.png',
        },
        preview: ROOTPATH + 'yulantu/2.png',
      },
      {
        id: 3,
        hour: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 15,
          posY: 224,
          path: ROOTPATH + 'pointer3/H.png',
        },
        minute: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 13,
          posY: 224,
          path: ROOTPATH + 'pointer3/M.png',
        },
        second: {
          centerX: centerXValue,
          centerY: centerYValue,
          posX: 4,
          posY: 224,
          path: ROOTPATH + 'pointer3/S.png',
        },
        preview: ROOTPATH + 'yulantu/3.png',
      },
    ]

    let pointerEdit = hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_POINTER, {
      edit_id: 120,
      x: 0,
      y: 0,
      config: pointerConfig,
      count: pointerConfig.length,
      default_id: 1,
      fg: ROOTPATH + 'edit/mask.png',
      tips_x: 132,
      tips_y: 400,
      tips_bg: ROOTPATH + 'edit/tips.png',
    })

    const screenType = hmSetting.getScreenType()
    const aodModel = screenType == hmSetting.screen_type.AOD
    const pointerProp = pointerEdit.getProperty(
      hmUI.prop.CURRENT_CONFIG,
      !aodModel,
    )

    hmUI.createWidget(hmUI.widget.TIME_POINTER, pointerProp)
    hmUI.createWidget(hmUI.widget.WATCHFACE_EDIT_FG_MASK, {
      x: 0,
      y: 0,
      w: 390,
      h: 450,
      src: 'images/mask/mask70.png',
      show_level: hmUI.show_level.ONLY_EDIT,
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
