// modules/keyboard-config.js
let IS_DEBUG = 0; // 1 - will break things but might show something useful

const MAX_CANDIDATES = 5;

const MULTITAP_TIMEOUT = 1200;
const LONGPRESS_THRESHOLD = 700;
const DEBOUNCE_TIME = 50;
const PREDICTION_DEBOUNCE = 150;

const COLORS = {
  DEBUG_DRAW: 0xFF00FF,
  BLACK: 0x000000,
  WHITE: 0xFFFFFF,
  BLUE: 0x0000FF,
}

const T9_LETTER_MAP = {
  '2': ['a', 'b', 'c'],
  '3': ['d', 'e', 'f'],
  '4': ['g', 'h', 'i'],
  '5': ['j', 'k', 'l'],
  '6': ['m', 'n', 'o'],
  '7': ['p', 'q', 'r', 's'],
  '8': ['t', 'u', 'v'],
  '9': ['w', 'x', 'y', 'z'],
  '0': ['0'],
  '*': ['*', '#',],
};

const SYMBOL_MAP = {
  '1': ['.', ',', '?', '!', "'", '"', '1', '-', '(', ')']
};

const NUMBER_SYMBOL_MAP = {
  '1': ['1', '.', ',', '?', '!'],
  '2': ['2', '@', '#', '$'],
  '3': ['3', '%', '&', '_'],
  '4': ['4', '+', '-', '='],
  '5': ['5', '/', '\\', '|'],
  '6': ['6', '[', ']', '{', '}'],
  '7': ['7', '<', '>', '^'],
  '8': ['8', ';', ':', '~'],
  '9': ['9', '`', '°', '±'],
  '0': [],
  '*': [],
};

const EMOJI_MAP = [
  '😊', '😄', '😂',
  '😍', '😭', '😡',
  '👍', '🔥', '🙏',
  '❤️', null, '🎉'
];

const KEYBOARD_MODES = {
  T9: 'T9',
  NUMBERS: 'NUMBERS',
  EMOJI: 'EMOJI'
};

const CAPS_MODES = {
  OFF: 'OFF',
  FIRST: 'FIRST',
  ON: 'ON',
  LOCK: 'LOCK'
};

export {
  T9_LETTER_MAP,
  SYMBOL_MAP,
  NUMBER_SYMBOL_MAP,
  EMOJI_MAP,
  KEYBOARD_MODES,
  CAPS_MODES,
  MULTITAP_TIMEOUT,
  LONGPRESS_THRESHOLD,
  DEBOUNCE_TIME,
  MAX_CANDIDATES,
  IS_DEBUG,
  COLORS,
  PREDICTION_DEBOUNCE,
};