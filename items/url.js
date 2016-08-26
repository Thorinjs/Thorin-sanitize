'use strict';
const url = require('url');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeJSON extends IFace {
    static code() { return "URL" };
    static publicName() { return "URL"; }

    /* Validate if the input is a valid url.
     * OPTIONS:
     *   public=true -> does the URL HAVE to be public?
     *   protocol="http,https" -> the protocols we allow.
     * */
    validate(d, opt) {
      if(typeof d !== 'string' || !d) return false;
      if(!opt.protocol) opt.protocol="http,https";
      let obj,
        protocols = (opt.protocol instanceof Array ? opt.protocol : opt.protocol.replace(/ /g,'').split(','));
      try {
        obj = url.parse(d);
      } catch(e) {
        return false;
      }
      if(!obj.protocol) return false;
      let hasProto = false;
      for(let i=0; i < protocols.length; i++) {
        if(obj.protocol.toLowerCase() === protocols[i].toLowerCase() + ':') {
          hasProto = true;
          break;
        }
      }
      if(!hasProto) return false;
      if(opt.public === true) {
        let tmpHost = obj.host.split('.'),
          isLocal = false;
        if(tmpHost.length === 4) {  // check localIps.
          var a = parseInt(tmpHost[0]), b = parseInt(tmpHost[1]), c = parseInt(tmpHost[2]), d = parseInt(tmpHost[3]);
          if(!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d)) {
            if(a === 127 || a === 192 || a === 172 || a === 10 || a === 0) {
              isLocal = true;
            }
          }
        } else if(tmpHost.length === 1) {
          isLocal = true;
        } else if(tmpHost.length === 2 && tmpHost[0] === 'localhost' && tmpHost[1] === 'localdomain') {
          isLocal = true;
        }
        if(isLocal) return false;
      }
      if(opt.hash !== true) {
        obj.hash = null;
        obj.href = obj.href.split('#')[0];
      }
      if(obj.port == null) {
        obj.port = (obj.protocol === 'http:' ? 80 : 443);
      } else {
        obj.port = parseInt(obj.port, 10);
      }
      return {
        value: obj
      };
    }
  }
};