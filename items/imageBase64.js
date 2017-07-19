'use strict';
/**
 * Base64 image validator
 */
const validator = require('validator');
module.exports = (IFace) => {

  return class SanitizeImageBase64 extends IFace {
    static code() {
      return "IMAGE_BASE64"
    };

    static publicName() {
      return "Base64 image";
    }

    /*
     * Verifies if the given string is base64 encoded and has the data: image headers.
     * OPTIONS:
     *  - type="jpeg|png|gif" - array of types
     *  - max= the maximum number of base64 characters.
     *  - min= the minimum number of base64 characters
     * */
    validate(d, opt) {
      if (typeof d !== 'string') return false;
      d = d.trim();
      // check the data:image/ string
      let t = d.substr(0, 11);
      if(t !== 'data:image/') return false;
      let imageType = d.substr(11, 20); // a maximum of 20 chars to find the base64, string
      imageType = imageType.split(';')[0];
      if(typeof imageType !== 'string' || !imageType) return false;
      if(opt.type) {
        let types = (opt.type instanceof Array ? opt.type : (typeof opt.type === 'string' ? opt.type.split(',') : [])),
          found = false;
        for(let i=0, len = types.length; i < len; i++) {
          if(types[i].toLowerCase() === imageType) {
            found = true;
            break;
          }
        }
        if(!found) return false;
      }
      // next validate the ;base64, string
      let baseTest = d.substr(11 + imageType.length, 8);
      if(baseTest !== ';base64,') return false;
      let fullBase64 = d.substr(11 + imageType.length + 8);
      if(typeof opt.max === 'number' && fullBase64.length > opt.max) return false;
      if(typeof opt.min === 'number' && fullBase64.length < opt.min) return false;
      if(!validator.isBase64(fullBase64)) return false;
      return {
        value: {
          mime: 'image/' + imageType,
          data: d,
          base64: fullBase64
        }
      };
    }
  }
};