'use strict';
const rangeCheck = require('range_check');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  const PRIVATE_BLOCK = [10, 127, 172, 192];

  return class SanitizeIP extends IFace {
    static code() { return "IP" };
    static publicName() { return "IP"; }

    /* Validate if the given IP is an IP address and if it is public / fits in the ranges.
     * OPTIONS:
     *    - range=[] -> array of CIDR ranges or individual IP addresses to check if they contain the IP
     *    - private -> if set, checks if the IP is private. IF it is not, returns false.
     *    - public -> if set, checks if the IP is public. IF it is not public, returns false;
     * */
    validate(d, opt) {
      if(typeof d !== 'string' || !d) return false;
      d = d.trim();
      if(!rangeCheck.validIp(d)) return false;
      let firstBlock = parseInt(d.split('.')[0]);
      if(opt.private === true && PRIVATE_BLOCK.indexOf(firstBlock) === -1) {
        return false;
      }
      if(opt.public === true && PRIVATE_BLOCK.indexOf(firstBlock) !== -1) {
        return false;
      }
      if(opt.range instanceof Array && opt.range.length !== 0) {
        let isOk = rangeCheck.inRange(d, opt.range);
        if(!isOk) return false;
      }
      return {
        value: d
      };
    }
  }
};