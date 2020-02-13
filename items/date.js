'use strict';
const validator = require('validator');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {
  const REGEX = /^\d+$/;
  return class SanitizeDate extends IFace {
    static code() {
      return "DATE"
    };

    static publicName() {
      return "Date";
    }

    /*
     * Verifies if the given input is a date
     * OPTIONS:
     *   opt.min -> the minimum date we want to allow, TIMESTAMP or DATE
     *   opt.max -> the maximum date we want to allow, TIMESTAMP or DATE
     * */
    validate(d, opt) {
      let val = null;
      if (typeof d === 'string') {
        if (REGEX.test(d)) {
          val = parseInt(d);
        } else {
          if (!validator.isISO8601(d)) {
            return false;
          }
          val = d;
        }
      } else if (typeof d === 'number') {
        val = d;
      } else if (d instanceof Date) {
        val = d;
      }
      if (val == null) return false;
      if (typeof val === 'number') {
        val = new Date(val);
      } else if (!(val instanceof Date)) {
        val = validator.toDate(d);
        if (!val) return false;
      }
      if (typeof opt.min !== 'undefined' || typeof opt.max !== 'undefined') {
        if (opt.min === 'NOW') opt.min = Date.now();
        if (opt.max === 'NOW') opt.max = Date.now();
        let ts = val.getTime(),
          min = (typeof opt.min === 'number' ? opt.min : (opt.min instanceof Date) ? opt.min.getTime() : null),
          max = (typeof opt.max === 'number' ? opt.max : (opt.max instanceof Date) ? opt.max.getTime() : null);
        if (min != null && ts < min) return false;
        if (max != null && ts > max) return false;
      }
      return {
        value: val
      }
    }
  }
};
