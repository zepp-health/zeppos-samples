import { Pai } from '@zos/sensor'
import PageAdvanced from '../../utils/template/PageAdvanced'
import TextByLine from '../../utils/UI/TextByLine'

PageAdvanced({
  state: {
    pageName: 'PAI'
  },
  build() {
    const pai = new Pai()

    new TextByLine({
      text: `todayPAI:${pai.getToday()}`,
      line: 0
    }).render()

    new TextByLine({
      text: `totalPAI:${pai.getTotal()}`,
      line: 1
    }).render()

    const lastWeekPAIArray = pai.getLastWeek()

    new TextByLine({
      text: `lastWeekPAI0:${lastWeekPAIArray[0]}`,
      line: 2
    }).render()

    new TextByLine({
      text: `lastWeekPAI1:${lastWeekPAIArray[1]}`,
      line: 3
    }).render()

    new TextByLine({
      text: `lastWeekPAI2:${lastWeekPAIArray[2]}`,
      line: 4
    }).render()

    new TextByLine({
      text: `lastWeekPAI3:${lastWeekPAIArray[3]}`,
      line: 5
    }).render()

    new TextByLine({
      text: `lastWeekPAI4:${lastWeekPAIArray[4]}`,
      line: 6
    }).render()

    new TextByLine({
      text: `lastWeekPAI5:${lastWeekPAIArray[5]}`,
      line: 7
    }).render()

    new TextByLine({
      text: `lastWeekPAI6:${lastWeekPAIArray[6]}`,
      line: 8
    }).render()
  }
})
