'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeArray extends IFace {
    static code() { return "ARRAY" };
    static publicName() { return "List"; }

    /* Validate if the input is an array.
    * - default delimiter: ","
    * Valid arrays are:
    *   -1,2,3,4
    *   -[1,2,3,4]
    *   -
    * OPTIONS:
    *   - parse - should we parse the inner values, if they're objects?
    *   - delimiter=, - the delimiter to use.
    *   - min - if specified, the min items.
    *   - max - if specified, the max items.
    *   - type - if specified, check the inner entry type.
    * */
    validate(d, opt) {
      let val = null,
        hasType = (typeof opt.type === 'string' ? true : false),
        delimiter = opt.delimiter || ',';
      if(d instanceof Array) {
        val = d;
      } else if(typeof d === 'string') {
        if(d.indexOf(delimiter) !== -1) {
          val = d.split(delimiter);
        } else {
          val = [d];
        }
      }
      if(!val) return false;
      if(opt.min && val.length < opt.min) return false;
      if(opt.max && val.length > opt.max) return false;
      if(opt.parse) {
        let i=0;
        while(i < val.length) {
          if(typeof val[i] === 'string') {
            try {
              val[i] = JSON.parse(val[i]);
            } catch(e) {
              // if it's a string, we skip.
              if(['{', '[', '"'].indexOf(val[i].charAt(0)) !== -1) {
                val.splice(i, 1);
                continue;
              }
            }
          }
          i++;
        }
      }
      if(hasType) {
        let i=0;
        while(i < val.length) {
          if(typeof val[i] === opt.type) {
            i++;
          } else {
            val.splice(i, 1);
          }
        }
      }
      return {
        value: val
      };
    }
  }
};