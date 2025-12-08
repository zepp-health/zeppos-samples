// modules/font-atlas.js
// a much better solution to frequent getTextLayout() calls

import { DeviceInfo } from "../../helpers/required";
const { width, height } = DeviceInfo; // getDeviceInfo()

// 480 emoji width = 28px, while bip 6 & active 2 = 32px; 32/28 = 1.143
// NOTE: heart emoji "❤️" is 50px wide @ 390x450 & 466x466
// so its actual ratio should be 1.786, but only for the TEXT widget width size compute
const emoji_ratio = (width === 480 && height === 480) ? 1.0 : 1.143;

// base measurement @text_size: px(28)
const BASE_FONT_SIZE = 28;

const BASE_SPACE_WIDTH = 7;
const BASE_ELLIPSIS_WIDTH = 21;
const BASE_AVG_CHAR_WIDTH = 14.583333;

// charas T9_LETTER_MAP, SYMBOL_MAP, NUMBER_SYMBOL_MAP, EMOJI_MAP
const BASE_CHAR_WIDTH_MAP = {
  "!":7,"\"":8,"#":17,"$":15,"%":20,"&":18,"\'":4,
  "(":10,")":10,"*":12,"+":16,",":7,"-":9,".":8,
  "/":11,"0":16,"1":16,"2":16,"3":16,"4":16,"5":16,
  "6":16,"7":16,"8":16,"9":16,":":8,";":6,"<":14,
  "=":16,">":15,"?":14,"@":24,"A":19,"B":17,"C":18,
  "D":18,"E":16,"F":15,"G":19,"H":20,"I":7,"J":16,
  "K":18,"L":15,"M":24,"N":20,"O":19,"P":18,"Q":19,
  "R":17,"S":17,"T":18,"U":19,"V":18,"W":25,"X":18,
  "Y":17,"Z":17,"[":8,"\\":12,"]": 8,"^": 12,"_": 15,
  "`":9,"a":15,"b":16,"c":15,"d":16,"e":15,"f":11,
  "g":16,"h":16,"i":7,"j":7,"k":15,"l":7,"m":24,
  "n":16,"o":16,"p":16,"q":16,"r":10,"s":15,"t":10,
  "u":16,"v":14,"w":21,"x":14,"y":14,"z":14,"{":9,
  "|":7,"}":10,"~":19,"°":11,"±":15
};

function getScaledWidths(font_size) {
  const scale = font_size / BASE_FONT_SIZE;
  
  const scaled_map = {};
  for (const c in BASE_CHAR_WIDTH_MAP) {
    scaled_map[c] = (BASE_CHAR_WIDTH_MAP[c] * scale) | 0;
  }
  
  return {
    CHAR_WIDTH_MAP: scaled_map,
    SPACE_WIDTH: (BASE_SPACE_WIDTH * scale) | 0,
    EMOJI_WIDTH: (font_size * emoji_ratio) | 0,
    ELLIPSIS_WIDTH: (BASE_ELLIPSIS_WIDTH * scale) | 0,
    AVG_CHAR_WIDTH: BASE_AVG_CHAR_WIDTH * scale
  };
}

export { getScaledWidths };