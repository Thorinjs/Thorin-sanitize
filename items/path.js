'use strict';
const validate = require('is-valid-path'),
  path = require('path');
/**
 * Path validator
 */
module.exports = (IFace) => {

  return class SanitizePath extends IFace {
    static code() {
      return "PATH"
    };

    static publicName() {
      return "Path";
    }

    /*
     * Verifies if the given input is a valid path.
     *  OPTIONS:
     *    - min: the min length
     *    - max: the max length
     *    - prefix: true -> we will always add the first /
     * */
    validate(d, opt) {
      if (typeof d !== 'string') return false;
      d = d.trim();
      d = d.replace(/\\/g,'/');
      if(!validate(d)) return false;
      if(typeof opt.min === 'number' && d.length < opt.min) return false;
      if(typeof opt.max === 'number' && d.length > opt.max) return false;
      try {
        d = path.normalize(d);
      } catch(e) {
        return false;
      }
      if(opt.prefix !== false) {
        if(d.charAt(0) !== '/') {
          d = '/' + d;
        }
      }
      return {
        value: d
      };
    }
  }
};