'use strict';

var Tone = require('tone');
var Instrument = require('./instrument.js');

var standard = new Tone.Synth();

var whatever = new Tone.Synth({
  "oscillator" : {
    "type" : "pwm",
    "modulationFrequency" : 0.2
  },
  "envelope" : {
    "attack" : 0.02,
    "decay" : 0.1,
    "sustain" : 0.2,
    "release" : 0.9,
  }
});

module.exports = {
  $: require('jquery'),
  SPM: require('./index.js'),
  WebSocketClient: require('./websocket_client.js'),
  Instruments: {
    standard: new Instrument(standard),
    whatever: new Instrument(whatever)
  }
}
