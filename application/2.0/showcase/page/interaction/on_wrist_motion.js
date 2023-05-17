import { prop } from '@zos/ui'
import { onWristMotion } from '@zos/interaction'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'onWristMotion'
  },
  build() {
    const textByLine = new TextByLine()

    const text = textByLine.render({
      text: `MOTION`
    })

    onWristMotion({
      callback: (data = {}) => {
        const { motion } = data
        this.state.logger.log('motion', motion)
        text.setProperty(prop.MORE, {
          text: `MOTION:${motion}`
        })
      }
    })
  }
})
