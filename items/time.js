'use strict';
/**
 * Sanitize a time string.
 * Time strings are:
 * {hh}:{mm}:{ss}.[ZZZZ]Z
 */
module.exports = (IFace) => {
  return class SanitizeTime extends IFace {
    static code() {
      return "TIME"
    };

    static publicName() {
      return "Time";
    }

    /* Validate the time string
    * {hh}:{mm}:{ss}[.{zzz}Z]
    * eg: 13:30 => 13:30:00
    *     19:25:31 => 19:25:31
    *     30::45:20 => INVALID
    *     14:42:10.029Z => 14:42:10
    * OPTIONS:
    *   - min = the minimum length the string must have
    *   - max = the maximum length the string must have.
    * */
    validate(d, opt) {
      let val = null;
      let t = getTime(d);
      if (!t) return false;
      if (typeof opt.min !== 'undefined') {
        let min = getTime(opt.min);
        if (!min) return false;
        if (min.sum > t.sum) return false;
      }
      if (typeof opt.max !== 'undefined') {
        let max = getTime(opt.max);
        if (!max) return false;
        if (max.sum < t.sum) return false;
      }
      return {
        value: t.time
      }
    }

  }
};

/* Private function that builds the time, given a string  of hh:mm:ss*/
function getTime(d) {
  if (typeof d !== 'string' || !d) return false;
  d = d.replace(/ /g, '');
  let ptIdx = d.indexOf('.');
  if (ptIdx !== -1) {
    d = d.substr(0, ptIdx);
  }
  let tmp = d.split(':');
  if (tmp.length === 2) tmp.push('00');
  if (tmp.length !== 3) return false;
  let h = parseInt(tmp[0]),
    m = parseInt(tmp[1]),
    s = parseInt(tmp[2]);
  if (isNaN(h) || isNaN(m) || isNaN(s)) return false;
  if (h < 0 || h > 23) return false;
  if (m < 0 || m > 60) return false;
  if (s < 0 || s > 60) return false;
  if (h < 10) h = '0' + h;
  if (m < 10) m = '0' + m;
  if (s < 10) s = '0' + s;
  return {
    sum: parseInt(`${h}${m}${s}`),
    time: `${h}:${m}:${s}`
  };
}
