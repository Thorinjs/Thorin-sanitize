'use strict';
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeBool extends IFace {
    static code() { return "BOOL" };
    static aliases() { return ["BOOLEAN"] }
    static publicName() { return "Boolean"; }

    /* Validate if the input is a boolean.
    * True values:
    * "true", '1', 1, true
    * False values:
    * "false", '0', 0, false
    * */
    validate(d, opt) {
      if(typeof d === 'undefined') return false;
      if(typeof d === 'boolean') return {
        value: d
      };
      if(typeof d === 'string') {
        if(d.toLowerCase() === 'true' || d === '1') {
          return {
            value: true
          }
        }
        if(d.toLowerCase() === 'false' || d === '0') {
          return {
            value: false
          };
        }
      }
      if(typeof d === 'number') {
        if(d === 1) {
          return {
            value: true
          }
        }
        if(d === 0) {
          return {
            value: false
          }
        }
      }
      return null;
    }
  }
};