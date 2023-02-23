export const before = function (mainFn, beforeFn) {
  return function (...args) {
    beforeFn.apply(this, args)

    return mainFn.apply(this, args)
  }
}

export const getRandomColor = () => {
  const randomArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']

  function getRandomFromSection(low, high) {
    const RANDOM = Math.random()
    const RANGE = high - low + 1

    return Math.floor(RANDOM * RANGE) + low
  }

  const colorStr = Array.from({ length: 6 }).reduce((prev, curr) => {
    const random = getRandomFromSection(0, 15)
    return prev + randomArr[random]
  }, '0x')

  return Number(colorStr)
}
