'use strict';

var INSTRUMENTS = require('./instruments.js');

module.exports = {
  SPM: require('./index.js'),
  WebSocketClient: require('./websocket_client.js'),
  DrawAdapter: require('./draw_adapter.js'),
  Instruments: {
    whatever: INSTRUMENTS.whatever,
    treeTrunk: INSTRUMENTS.treeTrunk,
    steelPan: INSTRUMENTS.steelPan,
    delicate: INSTRUMENTS.delicate,
    harmonic: INSTRUMENTS.harmonic,
    eletricCello: INSTRUMENTS.eletricCello,
    kalimba: INSTRUMENTS.kalimba,
    bassGuitar: INSTRUMENTS.bassGuitar
  }
}
