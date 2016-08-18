'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  const HEX_REGEX = /(^#*[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
  return class SanitizeColor extends IFace {
    static code() { return "COLOR" };
    static aliases() { return ["COLOR_HEX", "COLOR_RGBA"] }
    static publicName() { return "Color"; }

    /* Validate the string input
    * OPTIONS:
    *   - hex = true, should we validate hex colors
    *   - rgb = true, should we validate rgb colors
    *   - rgba = false, should we validate rgba colors
    * */
    validate(d, opt) {
      if(typeof d !== 'string' || !d) return false;
      d = d.trim();
      d = d.replace(/ /g,'').toLowerCase();
      if(d === '') return false;
      let isHex = (typeof opt.hex === 'boolean' ? opt.hex : true),
        isRgb = (typeof opt.rgb === 'boolean' ? opt.rgb : true),
        isRgba = (typeof opt.rgba === 'boolean' ? opt.rgba : false);
      if(isHex && HEX_REGEX.test(d)) {
        if(d.charAt(0) !== '#') {
          d = '#' + d;
        }
        return {
          value: d
        };
      }
      if(isRgb && d.substr(0, 4) === 'rgb(' && d.length <= 16) {
        try {
          let tmp = d.substr(4, d.length-5).split(',');
          if(tmp.length !== 3) throw 1;
          for(let i=0; i < tmp.length; i++) {
            let a = parseInt(tmp[i]);
            if(isNaN(a) || a > 255 || a < 0) throw 1;
          }
        } catch(e) {
          return false;
        }
        return {
          value: d
        }
      }
      if(isRgba && d.substr(0, 5) === 'rgba(' && d.length <= 30) {
        try {
          let tmp = d.substr(5, d.length-6).split(',');
          if(tmp.length !== 4) throw 1;
          for(let i=0; i < 3; i++) {
            let a = parseInt(tmp[i]);
            if(isNaN(a) || a > 255 || a < 0) throw 1;
          }
          let alpha = parseFloat(tmp[3]);
          if(alpha < 0 || alpha > 1) throw 1;
        } catch(e) {
          return false;
        }
        return {
          value: d
        }
      }
      return false;
    }
  }
};