const BaseService = require('./_baseservice.js');

module.exports = class ChromeDriver extends BaseService {
  constructor(props) {
    super(props);

  }

  startSession() {
    return this.client.post({
      body: {
        capabilities: {
          browserName: 'chrome'
        }
      }
    });
  }
};
