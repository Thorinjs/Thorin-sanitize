'use strict';
const validator = require('validator');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeDomain extends IFace {
    static code() { return "DOMAIN" };
    static publicName() { return "Domain"; }

    /* Validates if the given domain is a valid domain name
     * OPTIONS:
     *    - private=false -> if set to true, will pass if the domain is a local one
     *    - underscore=true -> allow underscores?
     * */
    validate(d, opt) {
      if(typeof d !== 'string' || !d) return false;
      d = d.trim().toLowerCase();
      d = d.replace(/\s+/g,'');
      let v = validator.isFQDN(d, {
        require_tld: opt.private ? false : true,
        allow_underscores: (typeof opt.underscore === 'undefined' ? true : opt.underscore)
      })
      if(!v) return false;
      return {
        value: d
      };
    }
  }
};