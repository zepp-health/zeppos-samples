import { InputMethodManager } from './input-method-engine'
import { styles } from 'zosLoader:./index.[pf].layout.js'
import { createWidget, deleteWidget, updateLayout, widget, align, prop, text_style, event, keyboard } from '@zos/ui'

function createKeyboard() {
  return createWidget(widget.VIRTUAL_CONTAINER, styles.container)
}

function createWidget2(type, props, layoutParent) {
  return createWidget(type, {
    ...props,
    parent: layoutParent,
  })
}

DataWidget({
  state: {
    inputText: '',
    inputBuffer: '',
    candidates: [],
    inputMethod: null,
    vc1: null,
  },

  setState(state) {
    for (const key in state) {
      this.state[key] = state[key]
    }

    this.renderCandidates(this.state.vc1)
  },

  onInit() {
    console.log('data widget onInit invoked')
    this.state.inputMethod = new InputMethodManager()
  },

  renderCandidates(vc1) {
    this.commitTextBuffer()
    const children = vc1.layoutChildren

    children.forEach((c) => {
      deleteWidget(c)
    })

    vc1.layoutChildren = []

    console.log('update-candidates', this.state.candidates)
    this.state.candidates.map((word, i) => {
      createWidget2(
        widget.BUTTON,
        {
          ...styles.candidateButton,
          text: word,
          click_func: (e) => {
            this.selectCandidate(word)
          },
        },
        vc1,
      )
    })

    updateLayout(vc1)
  },

  build() {
    const vc = createKeyboard()

    this.state.vc1 = createWidget2(widget.VIRTUAL_CONTAINER, styles.candidateBar, vc)

    this.renderCandidates(this.state.vc1)
    const vc2 = createWidget2(widget.VIRTUAL_CONTAINER, styles.keyboard, vc)
    this.renderCurrentInputKeys(vc2)
    this.renderActionKeys(vc2)
  },

  renderCurrentInputKeys(vc) {
    const currentMethod = this.state.inputMethod.currentMethod
    const keys =
      currentMethod === 'pinyin'
        ? [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
          ]
        : [
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          ]

    return keys.map((row, rowIndex) => {
      const row_w = createWidget(widget.VIRTUAL_CONTAINER, {
        parent: vc,
        ...styles.keyboardRow,
      })
      return row.map((key) => {
        return createWidget(widget.BUTTON, {
          ...styles.keyButton,
          parent: row_w,
          text: key,
          click_func: (e) => {
            this.handleKeyPress(key)
          },
        })
      })
    })
  },

  renderActionKeys(vc) {
    const vc3 = createWidget2(
      widget.VIRTUAL_CONTAINER,
      {
        layout: {
          ...styles.keyboardRow.layout,
          justify_content: 'center',
        },
      },
      vc,
    )

    createWidget2(
      widget.BUTTON,
      {
        ...styles.toggleLang,
        text: 'Del',
        click_func: (e) => {
          this.delete()
        },
        longpress_func: () => {
          this.deleteAll()
        },
      },
      vc3,
    )
    createWidget2(
      widget.BUTTON,
      {
        ...styles.toggleLang,
        text: 'Enter',
        click_func: (e) => {
          this.enter()
        },
      },
      vc3,
    )

    createWidget2(
      widget.BUTTON,
      {
        ...styles.toggleLang,
        text: '中英',
        click_func: (e) => {
          this.toggleLanguage()
        },
      },
      vc3,
    )

    createWidget2(
      widget.BUTTON,
      {
        ...styles.toggleLang,
        text: 'Lang',
        click_func: (e) => {
          this.toggleSelect()
        },
      },
      vc3,
    )
  },

  handleKeyPress(key) {
    const currentMethod = this.state.inputMethod.getCurrentMethod()
    this.setState({
      inputBuffer: this.state.inputBuffer + key,
      candidates: currentMethod.getCandidates(this.state.inputBuffer + key),
    })
  },

  selectCandidate(word) {
    const currentMethod = this.state.inputMethod.getCurrentMethod()
    currentMethod.handleSelect(word)
    const inputText = this.state.inputText + word
    this.setState({
      inputText: '',
      inputBuffer: '',
      candidates: [],
    })

    this.commitText(inputText)
  },

  toggleLanguage() {
    this.toggle()
    this.setState({
      inputBuffer: '',
      candidates: [],
    })
  },

  toggleSelect() {
    keyboard.sendFnKey(keyboard.SELECT)
  },

  toggle() {
    keyboard.sendFnKey(keyboard.SWITCH)
  },

  delete() {
    keyboard.sendFnKey(keyboard.BACKSPACE)
  },

  deleteAll() {
    this.setState({
      inputBuffer: '',
      candidates: [],
    })
    keyboard.clearInput()
  },

  enter() {
    keyboard.sendFnKey(keyboard.ENTER)
  },

  commitText(text) {
    keyboard.inputText(text)
  },

  commitTextBuffer() {
    keyboard.inputBuffer(this.state.inputBuffer, 0x757575, 0x757575)
  },

  onDestroy() {
    console.log('data widget onDestroy invoked')
  },
})
