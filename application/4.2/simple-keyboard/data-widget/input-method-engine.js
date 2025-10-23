import { dict } from './pinyin-dict'

// 输入法引擎接口
class InputMethodEngine {
  constructor() {
    this.history = {}
  }

  // 抽象方法 - 获取候选词
  getCandidates(input) {
    throw new Error('Method not implemented')
  }

  // 抽象方法 - 处理选择
  handleSelect(selected) {
    throw new Error('Method not implemented')
  }

  // 记录选择历史
  recordSelection(word) {
    this.history[word] = (this.history[word] || 0) + 1
  }

  // 根据历史排序
  sortByHistory(words) {
    return words.sort((a, b) => {
      const countA = this.history[a] || 0
      const countB = this.history[b] || 0
      return countB - countA
    })
  }
}

// 拼音输入法实现
export class PinyinInputMethod extends InputMethodEngine {
  constructor() {
    super()
    this.dict = dict
  }

  getCandidates(pinyin) {
    // 优先返回完整匹配
    if (this.dict.single[pinyin]) {
      return this.dict.single[pinyin]
    }

    // 处理多音字
    for (const [key, words] of Object.entries(this.dict.multiTone)) {
      if (pinyin.startsWith(key)) {
        return words
      }
    }

    // 模糊匹配
    const matches = []
    for (const [key, words] of Object.entries(this.dict.single)) {
      if (key.startsWith(pinyin)) {
        matches.push(...words)
      }
    }

    return this.sortByHistory(matches.slice(0, 5))
  }

  handleSelect(selected) {
    this.recordSelection(selected)
  }
}

// 英文输入法实现
export class EnglishInputMethod extends InputMethodEngine {
  getCandidates(input) {
    // 简单实现英文输入提示
    return this.sortByHistory([input])
  }

  handleSelect(selected) {
    this.recordSelection(selected)
  }
}

// 输入法管理器
export class InputMethodManager {
  constructor() {
    this.methods = {
      pinyin: new PinyinInputMethod(),
      english: new EnglishInputMethod()
    }
    this.currentMethod = 'pinyin'
  }

  // 切换输入法
  switchMethod(method) {
    if (this.methods[method]) {
      this.currentMethod = method
    }
  }

  // 获取当前输入法
  getCurrentMethod() {
    return this.methods[this.currentMethod]
  }
}