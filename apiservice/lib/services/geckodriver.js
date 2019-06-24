const BaseService = require('./_baseservice.js');

module.exports = class GeckoDriver extends BaseService {
  static get TraversalMode() {
    return {
      DFS: 'dfs',
      BFS: 'bfs'
    }
  }

  static bfsTraversal() {
    return function walkTheDOM(node, func) {
      const queue = Array.prototype.slice.call(document.body.childNodes, 0);
      while (queue.length > 0) {
        let n = queue.shift();
        func(n);
        if (!n.childNodes) {
          continue;
        }
        n.childNodes.forEach(function(childNode) {
          queue.push(childNode);
        });
      }
    }
  }

  static dfsTraversal() {
    return function walkTheDOM(node, func) {
      func(node);
      node = node.firstChild;
      while (node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
      }
    }
  }

  async startSession() {
    try {
      const response = await this.client.post({
        uri: '/session',
        body: {
          capabilities: {
            browserName: 'firefox',
            alwaysMatch: {
              acceptInsecureCerts: true
            }
          }
        }
      });

      this.session = response.value;
    } catch (err) {
      err.message = `An error occurred while starting a new session: ${err.message}.`;
      BaseService.handleWebdriverError(err);
    }
  }

  async endSession() {
    try {
      const response = await this.client.delete(`/session/${this.session.sessionId}`);

      return response.value;
    } catch (err) {
      err.message = `An error occurred while ending the session: ${err.message}.`;
      BaseService.handleWebdriverError(err);
    }
  }

  navigate(url) {
    try {
      return this.client.post({
        uri: `/session/${this.session.sessionId}/url`,
        body: {url}
      });
    } catch (err) {
      err.message = `An error occurred while navigating to URL: ${err.message}.`;
      BaseService.handleWebdriverError(err);
    }
  }

  processNodes(traversalMode = GeckoDriver.TraversalMode.DFS) {
    try {
      const scriptFn = `const nodes = [];
        walkTheDOM(document.body, function (node) {
          if (node.nodeType === 3) {
            let text = node.data.trim();
            if (text.length > 0) {
              nodes.push({
                length: text.length,
                font: node.parentNode ? getComputedStyle(node.parentNode)['font-family'] : ''
              });
            }
          }
        });
        
        return nodes.reduce(function(prev, value) {
          prev[value.font] = prev[value.font] || 0;
          prev[value.font] += value.length;
          return prev;
        }, {});
      `;

      const traversalFn = traversalMode === GeckoDriver.TraversalMode.DFS ?
        GeckoDriver.dfsTraversal() :
        GeckoDriver.bfsTraversal();

      const fn = `return function() {
        ${traversalFn.toString()};
        ${scriptFn}
      }();`;

      return this.client.post(`/session/${this.session.sessionId}/execute/sync`, {
        body: {
          script: fn,
          args: []
        }
      });
    } catch (err) {
      BaseService.handleWebdriverError(err);
    }
  }
};
