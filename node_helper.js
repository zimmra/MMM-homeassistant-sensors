var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-homeassistant-sensors helper started...');
  },

  getStats: function (config) {
      var self = this;
      var url = self.buildUrl(config);

      request({ url: url, method: 'GET', headers: { 'Authorization' : 'Bearer ' + config.token } }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            self.sendSocketNotification('STATS_RESULT', result);
          }
      });

  },

  buildUrl: function(config) {
      var url = config.host;
      if (config.port) {
          url = url + ':' + config.port;
      }

      url = url + '/api/states';

      if (config.https) {
          return 'https://' + url;
      }
      return 'http://' + url;
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_STATS') {
      this.getStats(payload);
    }
  }

});
