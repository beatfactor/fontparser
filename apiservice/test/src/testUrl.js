const request = require('request');
const assert = require('assert');

describe('parse fonts from test url', function() {
  this.timeout(20000);

  it('test with correct url', function(cb) {
    request({
      uri: 'http://localhost:3100/parseFonts?url=http://test_server:9100',
      json: true
    }, function (err, response, body) {
      if (err) {
        return cb(err);
      }

      try {
        assert.strictEqual(response.headers['app-version'], '1.0.0');
        assert.strictEqual(response.statusCode, 200);
        assert.deepEqual(Object.keys(body.fonts), ['Arial', 'Verdana', 'sans-serif', 'serif']);

        cb();
      } catch (e) {
        cb(e);
      }
    });

  });

  it('test with missing url', function(cb) {
    request({
      uri: 'http://localhost:3100/parseFonts',
      json: true
    }, function (err, response, body) {
      if (err) {
        return cb(err);
      }

      try {
        assert.strictEqual(response.statusCode, 404);
        assert.deepStrictEqual(body, {
          "status": "failed",
          "errors": [{
            "path": "",
            "message": "should have required property 'url'"
          }]
        });

        cb();
      } catch (e) {
        cb(e)
      }
    });
  });

  it('test with BFS traversal', function(cb) {
    request({
      uri: 'http://localhost:3100/parseFonts?url=http://test_server:9100&mode=bfs',
      json: true
    }, function (err, response, body) {
      if (err) {
        return cb(err);
      }

      try {
        assert.strictEqual(response.headers['app-version'], '1.0.0');
        assert.strictEqual(response.headers['x-traversal-mode'], 'bfs');
        assert.strictEqual(response.statusCode, 200);
        assert.deepEqual(Object.keys(body.fonts), ['Arial', 'Verdana', 'sans-serif', 'serif']);

        cb();
      } catch (e) {
        cb(e);
      }
    });

  });
});

