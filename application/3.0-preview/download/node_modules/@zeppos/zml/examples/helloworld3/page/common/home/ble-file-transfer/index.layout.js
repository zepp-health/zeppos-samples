import {
  TEXT_STYLE,
  BTN_STYLE,
  IMG_STYLE,
  PROGRESS_STYLE,
  FILE_NAME_STYLE,
  PROGRESS_TEXT_STYLE,
  PROGRESS_GROUP,
  BTN_STYLE2,
} from './index.style'
import ui from '@zos/ui'

export const layout = {
  refs: {},
  render(vm) {
    this.refs.txt = ui.createWidget(ui.widget.TEXT, {
      ...TEXT_STYLE,
    })

    this.refs.btn = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE,
      click_func: () => {
        vm.fileToSide()
      },
    })

    this.refs.btn2 = ui.createWidget(ui.widget.BUTTON, {
      ...BTN_STYLE2,
      click_func: () => {
        vm.cancelFile()
      },
    })

    this.refs.progressGroup = ui.createWidget(ui.widget.GROUP, {
      ...PROGRESS_GROUP,
    })

    this.refs.fileName = this.refs.progressGroup.createWidget(ui.widget.TEXT, {
      ...FILE_NAME_STYLE,
    })

    this.refs.progressTxt = this.refs.progressGroup.createWidget(
      ui.widget.TEXT,
      {
        ...PROGRESS_TEXT_STYLE,
      },
    )

    this.refs.progress = this.refs.progressGroup.createWidget(ui.widget.ARC, {
      ...PROGRESS_STYLE,
    })

    this.refs.img = ui.createWidget(ui.widget.IMG, {
      ...IMG_STYLE,
    })
  },
  updateTxtSuccess(text) {
    this.refs.txt.setProperty(ui.prop.MORE, {
      color: 0x00ff00,
      text,
    })
  },
  updateImgSrc(src) {
    this.refs.img.setProperty(ui.prop.MORE, {
      src: src,
    })
  },
  updateProgress({ fileName, progress }) {
    this.refs.fileName.setProperty(ui.prop.MORE, {
      color: 0x00ff00,
      text: fileName,
    })

    this.refs.progressTxt.setProperty(ui.prop.MORE, {
      color: 0x00ff00,
      text: progress,
    })

    this.refs.progress.setProperty(ui.prop.MORE, {
      end_angle: Math.ceil((progress / 100) * 360 - 90),
      color: 0x34e073,
    })
  },
}
