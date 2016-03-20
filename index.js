'use strict';
/**
 * Created by Adrian on 19-Mar-16.
 */
module.exports = function init(ISanitizer, thorin) {
  let items = thorin.util.readDirectory(__dirname + '/items'),
    result = [];
  items.forEach((i) => {
    let item = require(i)(ISanitizer);
    if(item instanceof Array) {
      result = result.concat(item);
    } else {
      result.push(item);
    }
  });
  return result;
};