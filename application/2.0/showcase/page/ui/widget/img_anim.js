import { createWidget, widget, event, prop, anim_status } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'IMG_ANIM'
  },
  build() {
    const imgAnimation = createWidget(widget.IMG_ANIM, {
      anim_path: 'anim',
      anim_prefix: 'animation',
      anim_ext: 'png',
      anim_fps: 60,
      anim_size: 36,
      repeat_count: 1,
      anim_status: 3,
      x: px(208),
      y: px(230),
      anim_complete_call: () => {
        this.state.logger.log('animation complete')
      }
    })

    imgAnimation.setProperty(prop.ANIM_STATUS, anim_status.START)
    imgAnimation.addEventListener(event.CLICK_DOWN, () => {
      const isRunning = imgAnimation.getProperty(prop.ANIM_IS_RUNINNG)

      if (!isRunning) {
        this.state.logger.log('running', isRunning)
        imgAnimation.setProperty(prop.ANIM_STATUS, anim_status.START)
      }

      imgAnimation.setProperty(prop.ANIM_STATUS, anim_status.START)
    })
  }
})
