'use strict';
/**
 * This sanitization type works with thorin-store-sql, specifically for when
 * referencing a model through its id field.
 * - This will essentially check the type of the field, and match the incoming sanitization
 * to the type of the model id
 * - It performs type checks and other checks.
 * Note:
 *  - it only handles INTEGER and STRING (as of now)
 */
const SIZE_JIGGLE = 4;
module.exports = (IFace) => {
  let thorin;
  return class SanitizeModelId extends IFace {
    static code() {
      return "MODEL"
    };

    static aliases() {
      return ["MODEL_ID", "MODEL"]
    }

    static publicName() {
      return "Model Id";
    }

    /**
     * OPTIONS:
     *   - model = the model name to use, from thorin.store('sql')
     *   - store=sql - the store to use.
     *   - field=id - the field name in the model to use.
     *   - thorin - if set, the thorin instance to use.
     * */
    validate(d, opt) {
      const { model = '', store = 'sql', field = 'id' } = opt;
      if (!thorin) thorin = opt.thorin || require('thorin');
      const storeObj = thorin.store(store);
      if (!storeObj) {
        console.log(`Model sanitizer does not have store ${store} loaded`);
        return false;
      }
      let Model = (typeof model === 'object' && model ? model : storeObj.model(model));
      if (!Model) {
        console.log(`Model sanitizer does not have model [${model}] loaded`);
        return false;
      }
      try {
        let idAttribute = Model.attributes[field];
        if (!idAttribute) return false;
        let attributeType = idAttribute.type.key;
        if (attributeType === 'INTEGER') {
          if (typeof d === 'string') d = parseInt(d);
          if (typeof d !== 'number' || isNaN(d) || d < 0) return false;
          return {
            value: d
          }
        }
        if (attributeType === 'STRING') {
          if (typeof d === 'number') d = d.toString();
          if (typeof d !== 'string' || !d) return false;
          d = d.trim();
          let isFixSize = false;
          if (typeof idAttribute.prefix === 'string' && idAttribute.prefix) {
            if (d.substr(0, idAttribute.prefix.length) !== idAttribute.prefix) return false;
            isFixSize = true;
          }
          if (idAttribute.type.options && idAttribute.type.options.length > 0) {
            let maxSize = idAttribute.type.options.length;
            if (isFixSize && d.length !== maxSize) return false;
            if (d.length > maxSize + SIZE_JIGGLE || d.length <= maxSize - SIZE_JIGGLE) return false;
          }
          return {
            value: d
          }
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  }
};
