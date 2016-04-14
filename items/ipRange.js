'use strict';
const rangeCheck = require('range_check');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeIPRange extends IFace {
    static code() { return "IP_RANGE" };
    static publicName() { return "IP Range"; }

    /* Validates if the given string is a valid IP Range.
    Eg: 0.0.0.0/0, 23.2.0.0/16, etc.
     * OPTIONS:
     * */
    validate(d, opt) {
      if(typeof d !== 'string' || !d) return false;
      d = d.trim();
      if(!rangeCheck.validRange(d)) return false;
      return {
        value: d
      };
    }
  }
};