'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeArray extends IFace {
    static code() {
      return "OBJECT"
    };

    static publicName() {
      return "Object";
    }

    /* Validate if the input is an object ({})
     * OPTIONS:
     *   - type - if specified, check the inner entry type.
     * */
    validate(d, opt) {
      let val = null,
        hasType = typeof opt.type === 'string';

      if (typeof d === 'string' && d) {
        try {
          val = JSON.parse(d);
        } catch (e) {
          return false;
        }
      }
      if (typeof val !== 'object' || !val || val instanceof Array) {
        return false;
      }
      if (hasType) {
        Object.keys(val).forEach((key) => {
          if (typeof val[key] !== opt.type) {
            delete val[key];
          }
        });
      }
      return {
        value: val
      }
    }
  }
};