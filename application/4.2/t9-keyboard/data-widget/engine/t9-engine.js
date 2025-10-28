// engine/t9-engine.js
import { debugLog } from '../../helpers/required';
import { dictionary } from './dictionary';

const L2D_MAP = {};
const T9_MAP_K = ['2', '3', '4', '5', '6', '7', '8', '9'];
const T9_MAP_V = ['abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];

// build letter to digit map
for (let i = 0; i < 8; i++) {
  const d = T9_MAP_K[i];
  const l = T9_MAP_V[i];
  for (let j = 0, len = l.length; j < len; j++) {
    L2D_MAP[l[j]] = d;
  }
}

class T9Engine {
  constructor(dict) {
    this.dictionary = dict;
    this.seq_cache = new Map();
    this.freq_map = new Map();
    this.seq_map = new Map();
    this.prefix_idx = new Map();
    this.pending_arr = [];
    this.is_processing = false;
    this.cur_seq = null;
    this.cancel_flag = false;
    this.buildSeqMap();
  }

  buildSeqMap() {
    debugLog(3, 'building t9 seq map...');
    const dict = this.dictionary;
    const dict_len = dict.length;
    
    // build seq_map
    for (let i = 0; i < dict_len; i++) {
      const word = dict[i];
      const seq = this.wordToSeq(word);
      let words_arr = this.seq_map.get(seq);
      if (!words_arr) {
        words_arr = [];
        this.seq_map.set(seq, words_arr);
      }
      words_arr.push(word);
    }

    // sort words by freq and len
    const freq_map = this.freq_map;
    for (const [_, words_arr] of this.seq_map) {
      words_arr.sort((a, b) => {
        const freq_a = freq_map.get(a) || 0;
        const freq_b = freq_map.get(b) || 0;
        if (freq_a !== freq_b) return freq_b - freq_a;
        const len_diff = a.length - b.length;
        if (len_diff !== 0) return len_diff;
        return a < b ? -1 : a > b ? 1 : 0;
      });
    }

    debugLog(3, `built seq map with ${this.seq_map.size} unique sequences`);
    debugLog(3, 'building prefix index...');

    // build prefix index
    for (const [seq, _] of this.seq_map) {
      const seq_len = seq.length;
      for (let i = 1; i <= seq_len; i++) {
        const prefix = seq.substring(0, i);
        let prefix_arr = this.prefix_idx.get(prefix);
        if (!prefix_arr) {
          prefix_arr = [];
          this.prefix_idx.set(prefix, prefix_arr);
        }
        prefix_arr.push(seq);
      }
    }

    debugLog(3, `built prefix index with ${this.prefix_idx.size} entries`);
  }

  wordToSeq(word) {
    let result = '';
    const word_len = word.length;
    for (let i = 0; i < word_len; i++) {
      const char = word[i];
      const char_code = char.charCodeAt(0);
      // lowercase conversion (A-Z to a-z)
      const lower_char = (char_code >= 65 && char_code <= 90) 
        ? String.fromCharCode(char_code + 32) 
        : char;
      const digit = L2D_MAP[lower_char];
      if (digit) result += digit;
    }
    return result;
  }

  getSuggestions(seq, typed_prefix, max_results, callback) {
    if (this.cur_seq !== seq) {
      this.pending_arr = [];
      this.cur_seq = seq;
      this.cancel_flag = true;
    }

    const request = {
      seq,
      typed_prefix,
      max_results,
      callback,
      timestamp: Date.now()
    };

    this.pending_arr.push(request);
    if (!this.is_processing) {
      this.processNext();
    }
  }

  processNext() {
    const pending_len = this.pending_arr.length;
    if (pending_len === 0) {
      this.is_processing = false;
      return;
    }

    this.is_processing = true;
    this.cancel_flag = false;
    const latest = this.pending_arr[pending_len - 1];
    this.pending_arr = [];

    this.getSuggestionsChunked(
      latest.seq,
      latest.typed_prefix,
      latest.max_results,
      (suggestions) => {
        if (!this.cancel_flag) {
          latest.callback(suggestions);
        }
        this.processNext();
      }
    );
  }

  getSuggestionsChunked(seq, typed_prefix, max_results, callback) {
    if (!seq) {
      callback([]);
      return;
    }

    const start_time = Date.now();
    const cache_key = `${seq}_${max_results}`;
    
    if (this.seq_cache.has(cache_key)) {
      debugLog(3, `t9 cache hit for "${seq}"`);
      const cached = this.seq_cache.get(cache_key);
      callback(this.applyCapitalization(cached, typed_prefix));
      return;
    }

    const suggestions_arr = [];
    const exact_matches = this.seq_map.get(seq);
    
    if (exact_matches) {
      const exact_len = exact_matches.length;
      for (let i = 0; i < exact_len && suggestions_arr.length < max_results; i++) {
        suggestions_arr.push(exact_matches[i]);
      }
    }

    if (suggestions_arr.length >= max_results) {
      this.seq_cache.set(cache_key, suggestions_arr);
      callback(this.applyCapitalization(suggestions_arr, typed_prefix));
      return;
    }

    const matching_seqs_arr = this.prefix_idx.get(seq) || [];
    const chunk_size = 20;
    let chunk_idx = 0;

    const processChunk = () => {
      if (this.cancel_flag) {
        return;
      }

      const start = chunk_idx * chunk_size;
      const matching_len = matching_seqs_arr.length;
      const end = start + chunk_size < matching_len ? start + chunk_size : matching_len;
      let found_in_chunk = false;

      for (let i = start; i < end && suggestions_arr.length < max_results; i++) {
        const longer_seq = matching_seqs_arr[i];
        const seq_len = seq.length;
        if (longer_seq.length > seq_len) {
          const words_arr = this.seq_map.get(longer_seq);
          if (words_arr) {
            const words_len = words_arr.length;
            for (let j = 0; j < words_len && suggestions_arr.length < max_results; j++) {
              const word = words_arr[j];
              
              let already_exists = false;
              const sugg_len = suggestions_arr.length;
              for (let k = 0; k < sugg_len; k++) {
                if (suggestions_arr[k] === word) {
                  already_exists = true;
                  break;
                }
              }
              if (!already_exists) {
                suggestions_arr.push(word);
                found_in_chunk = true;
              }
            }
          }
        }
      }

      chunk_idx++;

      if (suggestions_arr.length >= max_results || chunk_idx * chunk_size >= matching_len) {
        this.seq_cache.set(cache_key, suggestions_arr);
        const elapsed = Date.now() - start_time;
        if (elapsed > 5) {
          debugLog(3, `t9 search("${seq}"): ${elapsed}ms, ${suggestions_arr.length} results`);
        }
        callback(this.applyCapitalization(suggestions_arr, typed_prefix));
        return;
      }

      if (!found_in_chunk && chunk_idx > 5) {
        this.seq_cache.set(cache_key, suggestions_arr);
        callback(this.applyCapitalization(suggestions_arr, typed_prefix));
        return;
      }

      setTimeout(processChunk, 0);
    };

    setTimeout(processChunk, 0);
  }

  applyCapitalization(suggestions_arr, typed_prefix) {
    if (!typed_prefix) return suggestions_arr;
    
    const prefix_len = typed_prefix.length;
    if (prefix_len === 0) return suggestions_arr;

    const first_char = typed_prefix[0];
    const first_code = first_char.charCodeAt(0);
    const is_upper = first_code >= 65 && first_code <= 90;
    
    if (!is_upper) return suggestions_arr;

    const result_arr = [];
    const sugg_len = suggestions_arr.length;
    
    for (let i = 0; i < sugg_len; i++) {
      const word = suggestions_arr[i];
      const word_len = word.length;
      if (word_len > 0) {
        const first_char = word[0];
        const first_code = first_char.charCodeAt(0);
        // uppercase first char
        const upper_first = (first_code >= 97 && first_code <= 122) 
          ? String.fromCharCode(first_code - 32) 
          : first_char;
        result_arr.push(upper_first + word.substring(1));
      } else {
        result_arr.push(word);
      }
    }
    
    return result_arr;
  }

  cancel() {
    this.pending_arr = [];
    this.cur_seq = null;
    this.cancel_flag = true;
  }

  recordUsage(word) {
    const cur_count = this.freq_map.get(word) || 0;
    this.freq_map.set(word, cur_count + 1);
    this.seq_cache.clear();
  }
}

export const t9_engine = new T9Engine(dictionary);