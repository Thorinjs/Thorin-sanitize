'use strict';
const validator = require('validator');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  const REGEX = /^\d+$/;
  return class SanitizeDate extends IFace {
    static code() { return "DATE" };
    static publicName() { return "Date"; }

    /*
     * Verifies if the given input is a date
     * OPTIONS:
     *   TODO: add date options.
     * */
    validate(d, opt) {
      if(d instanceof Date) return {
        value: d
      };
      let val = null;
      if(typeof d === 'string') {
        if(REGEX.test(d)) {
          val = parseInt(d);
        } else {
          if(!validator.isDate(d)) {
            return false;
          }
          val = d;
        }
      } else if(typeof d === 'number') {
        val = d;
      }
      if(val == null) return false;
      if(typeof val === 'number') {
        val = new Date(val);
      } else {
        val = validator.toDate(d);
      }
      return {
        value: val
      }
    }
  }
};