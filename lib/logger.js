"use strict";

const _ = require("lodash");
const util = require("util");
const winston = require("winston");

/* By default, only log to the console. To log to a file as well, a log file
 * path should be added explicitly. The logger object exposes the log, info,
 * warn and error methods. */
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true
    })
  ]
});

logger.setLogFile = function(logFilePath) {
  this.add(new winston.transports.File({
    filename: logFilePath,
    json: false,
    maxsize: 20000000,
    timestamp: true
  }));
};

/* Parameter level is one of 'silly', 'verbose', 'debug', 'info', 'warn',
 * 'error'. */
logger.setLevel = function(level) {
  if (
    ["silly", "verbose", "debug", "info", "warn", "error"].indexOf(level) === -1
  ) {
    logger.error(
      'Unable to set logging level to unknown level "' + level + '".'
    );
  } else {
    /* Verbose and debug have not exactly the same semantic in Node-Mailin and
         * Winston, so handle that. */
    let consoleLogger = logger.transports.find(transport => transport.name === 'console')
    let fileLogger = logger.transports.find(transport => transport.name === 'file')

    if (consoleLogger.level === "verbose" && level === "debug") {
      return;
    }

    consoleLogger.level = level;

    if (fileLogger) fileLogger.level = level;
  }
};

logger._error = logger.error;
logger.error = function(err) {
  if (err.stack) {
    this._error(err.stack);
  } else if (!_.isString(err)) {
    this._error(
      util.inspect(err, {
        depth: 5
      })
    );
  } else {
    this._error.apply(this, arguments);
  }
};

module.exports = logger;
