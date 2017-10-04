'use strict';

var Instrument = require('./instrument.js');
var INSTRUMENTS = require('./instruments.js');

module.exports = {
  SPM: require('./index.js'),
  WebSocketClient: require('./websocket_client.js'),
  DrawAdapter: require('./draw_adapter.js'),
  Instruments: {
    whatever: new Instrument(INSTRUMENTS.whatever),
    treeTrunk: new Instrument(INSTRUMENTS.treeTrunk),
    steelPan: new Instrument(INSTRUMENTS.steelPan),
    delicate: new Instrument(INSTRUMENTS.delicate),
    harmonic: new Instrument(INSTRUMENTS.harmonic),
    eletricCello: new Instrument(INSTRUMENTS.eletricCello),
    kalimba: new Instrument(INSTRUMENTS.kalimba),
    bassGuitar: new Instrument(INSTRUMENTS.bassGuitar)
  }
}
