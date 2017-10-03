'use strict';

/**
 * Provide a simple WebSocket connection
 * @return {object}
 */
module.exports = function() {

  var WebSocketClient = function(address) {
    this.WebSocket = window.WebSocket || window.MozWebSocket;
    this.address = address;
    this.callbacks = [];
  }

  WebSocketClient.prototype.registerListener = function(callback) {
    this.callbacks.push(callback);
  }

  WebSocketClient.prototype.setupConnection = function() {
    this.connection.onopen = function () {
      console.log('[WS conn OK]');
    };

    this.connection.onclose = (function (_this) {
      return function() {
        console.log('[WS closed]');
        window.setTimeout(function(){
          _this.connect();
        }, 1000);
      }
    })(this);

    this.connection.onerror = function (error) {
      console.log('Some error with WebSocket');
    };

    this.connection.onmessage = this.onWsMessage.bind(this);
  }

  WebSocketClient.prototype.onWsMessage = function(message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
    }

    for(var callback of this.callbacks) {
      callback(json);
    }
  }

  WebSocketClient.prototype.connect = function() {
    this.connection = new this.WebSocket(this.address);
    this.setupConnection();
  }

  return WebSocketClient;
}()
