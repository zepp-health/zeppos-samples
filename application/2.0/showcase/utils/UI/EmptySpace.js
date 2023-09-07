import { createWidget, widget } from '@zos/ui'
import { px } from '@zos/utils'
import { DEVICE_HEIGHT, DEVICE_WIDTH } from './../../config/device'
const EMPTY_SPACE = {
    x: 0,
    y: 0,
    w: DEVICE_WIDTH,
    h: Math.ceil(DEVICE_HEIGHT / 3),
    color: 0x000000
}
export default class EmptySpace {
    constructor(params) {
        const { y = px(40) } = params
        this.y = y
    }

    render() {
        if (this.y > Math.ceil(DEVICE_HEIGHT * 2 / 3)) {
            createWidget(widget.FILL_RECT, {
                ...EMPTY_SPACE,
                y: this.y
            })
        }
    }
}
