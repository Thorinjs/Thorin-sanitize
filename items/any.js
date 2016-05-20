'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeANY extends IFace {
    static code() {
      return "ANY"
    };

    static publicName() {
      return "Any";
    }

    /* Validate if the input is present.
     * OPTIONS:
     *   max - the maximum JSON length. Defaults to 10000
     * */
    validate(d, opt) {
      if (typeof d === 'undefined') return false;
      if (!opt.max) opt.max = 10000;
      if (typeof d === 'object' && d) {
        try {
          let r = JSON.stringify(d);
          if (r.length > opt.max) throw 1;
          return {
            value: JSON.parse(r)
          };
        } catch (e) {
          return false;
        }
      }
      if (typeof d === 'string' && d.length < opt.max) {
        return {
          value: d
        }
      } else if (typeof d === 'number' || typeof d === 'boolean') {
        return {
          value: d
        };
      }
      return false;
    }
  }
};