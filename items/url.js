'use strict';
const url = require('url');
/**
 * Created by Adrian on 20-Mar-16.
 */
module.exports = (IFace) => {

  return class SanitizeJSON extends IFace {
    static code() {
      return "URL"
    };

    static publicName() {
      return "URL";
    }

    /* Validate if the input is a valid url.
     * OPTIONS:
     *   public=true -> does the URL HAVE to be public?
     *   protocol="http,https" -> the protocols we allow.
     *   parse=false -> if set to true, we will return the actual href in the result, not the parsed url
     *   wildcard=false -> if set to true, validate *.john.com domains
     * */
    validate(d, opt) {
      if (typeof d !== 'string' || !d) return false;
      if (!opt.protocol) opt.protocol = "http,https";
      let obj,
        protocols = (opt.protocol instanceof Array ? opt.protocol : opt.protocol.replace(/ /g, '').split(',')),
        hasWildcard = (d.indexOf('*') !== -1);
      if (hasWildcard) {
        if (opt.wildcard !== true) return false;
        if (d.indexOf('*') !== d.lastIndexOf('*')) return false;  // no more than 1 star
        try {
          let _check = d.split('://')[1].replace(/ /g, '').split('.');
          if (_check.length > 40) return false;
          if (_check[_check.length - 1] === '*') return false;
          if (_check[_check.length - 2] === '*') return false;
          if (_check[0] !== '*') return false;  // only allow *.subdomain.com
        } catch (e) {
          return false;
        }
        d = d.replace(/\*/g, '__wildcard__');
      }
      try {
        obj = url.parse(d);
      } catch (e) {
        return false;
      }
      if (!obj.protocol) return false;
      if (hasWildcard) {
        obj.wildcard = true;
        if (obj.host) obj.host = obj.host.split('__wildcard__').join('*');
        if (obj.hostname) obj.hostname = obj.hostname.split('__wildcard__').join('*');
      }
      let hasProto = false;
      for (let i = 0; i < protocols.length; i++) {
        if (obj.protocol.toLowerCase() === protocols[i].toLowerCase() + ':') {
          hasProto = true;
          break;
        }
      }
      if (!hasProto) return false;
      if (opt.public === true) {
        let tmpHost = obj.host.split('.'),
          isLocal = false;
        if (tmpHost.length === 4) {  // check localIps.
          var a = parseInt(tmpHost[0]), b = parseInt(tmpHost[1]), c = parseInt(tmpHost[2]), d = parseInt(tmpHost[3]);
          if (!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d)) {
            if (a === 127 || a === 192 || a === 172 || a === 10 || a === 0) {
              isLocal = true;
            }
          }
        } else if (tmpHost.length === 1) {
          isLocal = true;
        } else if (tmpHost.length === 2 && tmpHost[0] === 'localhost' && tmpHost[1] === 'localdomain') {
          isLocal = true;
        }
        if (isLocal) return false;
      }
      if (opt.hash !== true) {
        obj.hash = null;
        obj.href = obj.href.split('#')[0];
      }
      if (obj.port == null) {
        obj.port = (obj.protocol === 'http:' ? 80 : 443);
      } else {
        obj.port = parseInt(obj.port, 10);
      }
      // remove double quotes of the href and/or path
      if (obj.path.indexOf('//') !== -1) {
        const regex = /\/\/+/g;
        obj.path = obj.path.replace(regex, '/');
        obj.pathname = obj.pathname.replace(regex, '/');
        let tmp = obj.href.split('://');
        tmp[1] = tmp[1].replace(regex, '/');
        obj.href = tmp.join('://');
      }
      if (opt.parse === false) return {
        value: obj.href
      };
      return {
        value: obj
      };
    }
  }
};
