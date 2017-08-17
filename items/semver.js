'use strict';
/**
 * Semantic versioning simple checker.
 *
 * {major}.{minor}.{patch}
 */
module.exports = (IFace) => {
  return class SanitizeSemver extends IFace {
    static code() {
      return "SEMVER"
    };

    static publicName() {
      return "Semver";
    }

    /* Validate the string input
    * OPTIONS:
    *
    * */
    validate(d, opt) {
      if (typeof d !== 'string' || !d) return false;
      d = d.trim();
      d = d.replace(/ /g, '').toLowerCase();
      if (d === '') return false;
      let tmp = d.split('.');
      if (tmp.length !== 3) return false;
      let major = parseInt(tmp[0], 10),
        minor = parseInt(tmp[1], 10),
        patch = parseInt(tmp[2], 10);
      if (isNaN(major) || isNaN(minor) || isNaN(patch)) return false;
      if (major < 0 || minor < 0 || patch < 0) return false;
      if (major === 0 && minor === 0 && patch === 0) return false;
      d = major + '.' + minor + '.' + patch;
      return {
        value: d
      }
    }
  }
};