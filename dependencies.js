'use strict';

var Tone = require('tone');
var Instrument = require('./instrument.js');

var standard = new Tone.Synth();

var whatever = new Tone.Synth({
  "oscillator" : {
    "type" : "pwm",
    "modulationFrequency" : 0.9
  },
  "envelope" : {
    "attack" : 0.9,
    "decay" : 0.7,
    "sustain" : 0.9,
    "release" : 0.2,
  }
});

module.exports = {
  SPM: require('./index.js'),
  WebSocketClient: require('./websocket_client.js'),
  DrawAdapter: require('./draw_adapter.js'),
  Instruments: {
    standard: new Instrument(standard)
    //whatever: new Instrument(whatever)
  }
}
