'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeJSON extends IFace {
    static code() { return "JSON" };
    static publicName() { return "JSON"; }

    /* Validate if the input is a json.
    * OPTIONS:
    *   max - the maximum JSON length. Defaults to 10000
    * */
    validate(d, opt) {
      if(typeof d === 'undefined') return false;
      if(typeof opt.max === 'undefined') {
        opt.max = 10000;
      }
      if(typeof d === 'object' && d) {
        try {
          if(typeof opt.max === 'number') {
            let r = JSON.stringify(d);
            if(r.length > opt.max) throw 1;
            return {
              value: JSON.parse(r)
            };
          }
          return {
            value: d
          };
        } catch(e) {
          return false;
        }
      }
      if(typeof d === 'string') {
        if(typeof opt.max === 'number' && d.length > opt.max) return false;
        try {
          d = JSON.parse(d);
        } catch(e) {
          return false;
        }
        return {
          value: d
        };
      }
      return false;
    }
  }
};