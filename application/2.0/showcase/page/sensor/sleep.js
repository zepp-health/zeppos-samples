import { Sleep } from '@zos/sensor'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'SLEEP'
  },
  build() {
    const sleep = new Sleep()

    const { score, deepTime, startTime, endTime, totalTime } = sleep.getInfo()

    new TextByLine({
      text: `score:${score};deepTime:${deepTime};startTime:${startTime};endTime:${endTime}`,
      line: 0
    }).render()

    new TextByLine({
      text: `totalTime:${totalTime}`,
      line: 1
    }).render()

    const stageObj = sleep.getStageConstantObj()
    this.state.logger.log(stageObj.WAKE_STAGE)
    this.state.logger.log(stageObj.REM_STAGE)
    this.state.logger.log(stageObj.LIGHT_STAGE)
    this.state.logger.log(stageObj.DEEP_STAGE)

    const sleepStageArray = sleep.getStage()

    for (let i = 0; i < sleepStageArray.length; i++) {
      const element = sleepStageArray[i]
      const { model, start, stop } = element

      new TextByLine({
        text: `model:${model};start:${start};stop:${stop}`,
        line: i + 2
      }).render()
    }
  }
})
