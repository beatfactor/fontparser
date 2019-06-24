const requestPromise = require('request-promise-native');

class BaseService {
  /**
   * @param {Error} err
   */
  static handleWebdriverError(err) {
    const logErr = new Error(err.message);

    if (err.options) {
      logErr.url = `${err.options.baseUrl}${err.options.uri}`;
      logErr.method = err.options.method;
    }

    if (err.cause) {
      logErr.cause = err.cause;
    }

    throw logErr;
  }

  /**
   * @return {Promise}
   */
  get client() {
    return requestPromise.defaults(this.options);
  }

  /**
   *
   * @constructor
   * @param {object} options
   */
  constructor(options = {}) {
    this.options = Object.assign({}, options, {
      json: true
    });
  }

}

module.exports = BaseService;
