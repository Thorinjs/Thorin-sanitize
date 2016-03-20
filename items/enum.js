'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeENUM extends IFace {
    static code() { return "ENUM" };
    static publicName() { return "Enumerable"; }

    /* Verifies if the input is one of the given enums.
    * The options are the exact values of the enum.
    * */
    validate(d, values) {
      if(!(values instanceof Array)) values = [];
      if(typeof d !== 'string' && typeof d !== 'number') return false;
      let val = null;
      for(let i=0; i < values.length; i++) {
        if(typeof values[i] === 'string' && typeof d == 'string') {
          if(values[i].toUpperCase() === d.toUpperCase()) {
            val = values[i];
            break;
          }
        } else if(typeof values[i] === 'number') {
          if(typeof d !== 'number') {
            d = parseInt(d);
            if(isNaN(d)) continue;
          }
          if(values[i] === d) {
            val = values[i];
            break;
          }
        }
      }
      if(val == null) return false;
      return {
        value: val
      };
    }
  }
};