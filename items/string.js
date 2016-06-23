'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  return class SanitizeString extends IFace {
    static code() {
      return "STRING"
    };

    static aliases() {
      return ["TEXT", "LONGTEXT", "VARCHAR"]
    }

    static publicName() {
      return "String";
    }

    /* Validate the string input
     * OPTIONS:
     *   - min = the minimum length the string must have
     *   - max = the maximum length the string must have.
     * */
    validate(d, opt) {
      if (typeof d === 'number') {
        d = d.toString();
      } else if (typeof d === 'boolean') {
        d = d.toString();
      }
      if (typeof d !== 'string' || !d) return false;
      d = d.trim();
      if (d === '') return false;
      if (opt.min > 0 && d.length < opt.min) {
        return false;
      }
      if (opt.max > 0 && d.length > opt.max) {
        return false;
      }
      d = d.replace(/'/g, "\x27");
      d = d.replace(/"/g, "\x22");
      if (opt.html !== true) {
        d = d.replace(/</g, "&lt;");
        d = d.replace(/>/g, "&gt;");
      }
      return {
        value: d
      };
    }
  }
};