'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  const REGEX = /^-?\d+\.?\d*$/;  // allows +- numbers, and float.
  return class SanitizeNumber extends IFace {
    static code() { return "FLOAT" };
    static aliases() { return ["DECIMAL"] }
    static publicName() { return "Float"; }

    /* Validate the string input
    * OPTIONS:
    *   - min = the minimum value of the number
    *   - max = the minimum value of the number
    * */
    validate(d, opt) {
      let val = null;
      if(typeof d === 'number') {
        val = d;
      } else if(typeof d === 'string') {
        if(!REGEX.test(d)) return false;
        val = parseFloat(d);
      }
      if(val == null || isNaN(val)) return false;
      if(typeof opt.min === 'number' && val < opt.min)  return false;
      if(typeof opt.max === 'number' && val > opt.max) return false;
      return {
        value: val
      }
    }

  }
};