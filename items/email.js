'use strict';
const validator = require('validator');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeEmail extends IFace {
    static code() {
      return "EMAIL"
    };

    static publicName() {
      return "Email";
    }

    /*
    * Verifies if the given input is an e-mail.
    * OPTIONS:
    *   tld: true -> if we need to verify the tld
    *   empty -> if set to true, allow empty string
    *   allowName -> if set to true, checks for the following construct: "Some Name <some@name.com>"
    * */
    validate(d, opt) {
      if (typeof d !== 'string') return false;
      d = d.trim();
      if (d === '') {
        if (opt.empty === true) return {
          value: ''
        };
        return false;
      }
      let valuePrefix = '',
        valueSuffix = '';
      if (opt.allowName === true) {
        let openIdx = d.indexOf('<'),
          closeIdx = d.indexOf('>');
        if (openIdx !== -1 && closeIdx > openIdx) {
          let emailName = d.substr(0, openIdx).trim();
          d = d.substr(openIdx + 1).split('>')[0];
          valuePrefix = emailName + ' <';
          valueSuffix = '>';
        }
      }
      let v = validator.isEmail(d, {
        require_tld: (opt.tld !== false)
      });
      if (!v) return false;
      d = validator.normalizeEmail(d, {
        remove_dots: false,
        remove_extension: false
      });
      return {
        value: valuePrefix + d + valueSuffix
      };
    }
  }
};
