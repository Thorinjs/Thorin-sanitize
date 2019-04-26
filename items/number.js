'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  const REGEX = /^-?\d+\.?\d*$/,  // allows +- numbers, and float.
    REGEX_INT = /^[\-]\d+$/;
  return class SanitizeNumber extends IFace {
    static code() { return "NUMBER" };
    static aliases() { return ["INTEGER"] }
    static publicName() { return "Number"; }

    /* Validate the string input
    * OPTIONS:
    *   - string = if set to true, verifies that the this is a string number.
    *   - min = the minimum length the string must have
    *   - max = the maximum length the string must have.
    *   - float = should we use parseInt or parseFloat?
    * */
    validate(d, opt) {
      let val = null;
      if(opt.string === true) {
        if(typeof d === 'number') {
          d = d.toString();
        }
        if(typeof d !== 'string') return false;
        d = d.replace(/ /g,'');
        if(opt.float) {
          if(!REGEX.test(d)) return false;
        } else {
          if(!REGEX_INT.test(d)) return false;
        }
        // CHECK if we have min/ max for it.
        if(opt.min && d.length < opt.min) return false;
        if(opt.max && d.length > opt.max) return false;
        return {
          value: d
        }
      }
      if(typeof d === 'number') {
        val = d;
      } else if(typeof d === 'string') {
        if(opt.float) {
          if(!REGEX.test(d)) return false;
        } else {
          if(!REGEX_INT.test(d)) return false;
        }
        val = (opt.float ? parseFloat(d) : parseInt(d));
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