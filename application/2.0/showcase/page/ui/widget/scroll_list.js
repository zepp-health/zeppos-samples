import { createWidget, widget, prop } from '@zos/ui'
import { px } from '@zos/utils'
import PageAdvanced from '../../../utils/template/PageAdvanced'

PageAdvanced({
  state: {
    pageName: 'SCROLL_LIST'
  },
  build() {
    const dataList = [
      { name: 'Amazfit T-Rex 2', size: 454, img_src: 'true.png' },
      { name: 'Amazfit GTR 3 Pro', size: 480, img_src: 'true.png' },
      { name: 'Amazfit GTR 3', size: 454, img_src: 'true.png' }
    ]

    const updateDataList = [
      ...dataList,
      { name: 'Amazfit GTS 3', size: 390 },
    ]

    const scroll_list = createWidget(widget.SCROLL_LIST, {
      x: 0,
      y: px(120),
      h: px(300),
      w: px(480),
      snap_to_center: true,
      item_enable_horizon_drag: true,
      item_drag_max_distance: -px(200),
      item_space: px(20),
      item_config: [
        {
          type_id: 1,
          item_bg_color: 0xef5350,
          item_bg_radius: px(10),
          text_view: [
            { x: 0, y: 0, w: px(480), h: px(80), key: 'name', color: 0xffffff, text_size: px(20), action: true },
            { x: 0, y: px(80), w: px(480), h: px(40), key: 'size', color: 0xffffff }
          ],
          text_view_count: 2,
          image_view: [
            { x: px(520), y: px(0), w: px(80), h: px(63), key: 'img_src', action: true },
          ],
          image_view_count: 1,
          item_height: px(120)
        },
        {
          type_id: 2,
          item_bg_color: 0xef5350,
          item_bg_radius: px(10),
          text_view: [
            { x: 0, y: 0, w: px(480), h: px(80), key: 'name', color: 0x000000, text_size: px(20) },
            { x: 0, y: px(80), w: px(480), h: px(40), key: 'size', color: 0x000000 }
          ],
          text_view_count: 2,
          image_view: [
            { x: px(520), y: px(0), w: px(80), h: px(63), key: 'img_src', action: true },
          ],
          image_view_count: 1,
          item_height: px(120)
        }
      ],
      item_config_count: 2,
      data_array: dataList,
      data_count: dataList.length,
      item_click_func: (list, index, data_key) => {
        this.state.logger.log('list', list)
        this.state.logger.log(`scrollListItemClick index=${index}`)
        this.state.logger.log(`scrollListItemClick data_key=${data_key}`)
        updateConfig()
      },
      item_focus_change_func: (list, index, focus) => {
        this.state.logger.log('index', index)
        this.state.logger.log(`itemFocusChange focus=${focus}`)
      },
      data_type_config: [
        {
          start: 0,
          end: 1,
          type_id: 1
        },
        {
          start: 1,
          end: 2,
          type_id: 2
        }
      ],
      data_type_config_count: 2
    })

    function updateConfig() {
      scroll_list.setProperty(prop.UPDATE_DATA, {
        data_type_config: [
          {
            start: 0,
            end: updateDataList.length - 1,
            type_id: 1
          },
        ],
        data_type_config_count: 1,
        data_array: updateDataList,
        data_count: updateDataList.length,
        on_page: 1
      })
    }
  }
})
