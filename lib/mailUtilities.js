"use strict";

const dkim = require("dkim");
var SPFValidator = require("spf-validator");

const logger = require("./logger");

/* Provides high level mail utilities such as checking dkim, spf and computing
 * a spam score. */
module.exports = {
  /* @param rawEmail is the full raw mime email as a buffer. */
  validateDkim: function(rawEmail, callback) {
    dkim.verify(rawEmail, (err, data) => {
      if (err) {
        return callback(err);
      } else {
        return callback(null, true);
      }
    });
  },

  validateSpf: function(ip, host = "", email = "", callback) {
    const domain = email.replace(/.*@/, "");
    logger.verbose(`validsting spf for host ${domain} and ip ${ip}`);
    const validator = new SPFValidator(domain);
    validator.hasRecords((err, hasRecords) => callback(err, hasRecords));
  },

  /* @param rawEmail is the full raw mime email as a string. */
  computeSpamScore: function(rawEmail, callback) {
   return callback(null, 0.0)
  }
};
