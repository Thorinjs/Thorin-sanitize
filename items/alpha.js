'use strict';
const validator = require('validator');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeAlpha extends IFace {
    static code() { return "ALPHA" };
    static publicName() { return "Alpha"; }

    /*
     * Verifies if the given input is alpha-string
     * OPTIONS:
     *  - dot=false -> should we allow dots in the alpha?
     *  - dash=false -> should we allow dashes in the alpha?
     *  - underscore=false -> should we allow underscore in the alpha?
     *  - numeric=false -> transforms into AlphaNumeric
     * */
    validate(d, opt) {
      if(typeof d !== 'string') return false;
      d = d.trim();
      let checker = d;
      if(opt.dot === true) {
        checker = checker.replace(/\./g, '');
      }
      if(opt.dash === true) {
        checker = checker.replace(/\-/g,'');
      }
      if(opt.underscore === true) {
        checker = checker.replace(/_/g,'');
      }
      let validateFn = (opt.numeric === true ? 'isAlphanumeric' : 'isAlpha');
      if(!validator[validateFn](checker)) return false;
      return {
        value: d
      };
    }
  }
};