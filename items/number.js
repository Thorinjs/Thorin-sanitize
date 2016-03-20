'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  const REGEX = /^-?\d+\.?\d*$/;  // allows +- numbers, and float.
  return class SanitizeNumber extends IFace {
    static code() { return "NUMBER" };
    static publicName() { return "Number"; }

    /* Validate the string input
    * OPTIONS:
    *   - min = the minimum length the string must have
    *   - max = the maximum length the string must have.
    *   - float = should we use parseInt or parseFloat?
    * */
    validate(d, opt) {
      let val = null;
      if(typeof d === 'number') {
        val = d;
      } else if(typeof d === 'string') {
        if(!REGEX.test(d)) return false;
        val = (opt.float ? parseFloat(d) : parseInt(d));
      }
      if(val == null || isNaN(val)) return false;
      if(opt.min && val < opt.min)  return false;
      if(opt.max && val > opt.max) return false;
      return {
        value: val
      }
    }

  }
};