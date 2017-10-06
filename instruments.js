'use strict';

var Tone = require('tone');
var Instrument = require('./instrument.js');

var whatever = new Instrument(Tone.Synth);
var treeTrunk = new Instrument(Tone.Synth);
var steelPan = new Instrument(Tone.Synth);
var delicate = new Instrument(Tone.Synth);
var harmonic = new Instrument(Tone.AMSynth);
var eletricCello = new Instrument(Tone.FMSynth);
var kalimba = new Instrument(Tone.FMSynth);
var bassGuitar = new Instrument(Tone.MonoSynth);

whatever.set({
  "oscillator": {
    "partials": [
        1,
        0,
        2,
        0,
        3
      ]
  },
  "envelope": {
    "attack": 0.001,
    "decay": 1.2,
    "sustain": 0,
    "release": 1.2
  }
});

treeTrunk.set({
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.001,
    "decay": 0.1,
    "sustain": 0.1,
    "release": 1.2
  }
});

steelPan.set({
  "oscillator": {
    "type": "fatcustom",
    "partials" : [0.2, 1, 0, 0.5, 0.1],
    "spread" : 40,
    "count" : 3
  },
  "envelope": {
    "attack": 0.001,
    "decay": 1.6,
    "sustain": 0,
    "release": 1.6
  }
});

delicate.set({
  "portamento" : 0.0,
  "oscillator": {
    "type": "square4"
  },
  "envelope": {
    "attack": 2,
    "decay": 1,
    "sustain": 0.2,
    "release": 2
  }
});

harmonic.set({
  "harmonicity": 3.999,
  "oscillator": {
    "type": "square"
  },
  "envelope": {
    "attack": 0.03,
    "decay": 0.3,
    "sustain": 0.7,
    "release": 0.8
  },
  "modulation" : {
    "volume" : 12,
    "type": "square6"
  },
  "modulationEnvelope" : {
    "attack": 2,
    "decay": 3,
    "sustain": 0.8,
    "release": 0.1
  }
});

eletricCello.set({
  "harmonicity": 3.01,
  "modulationIndex": 14,
  "oscillator": {
    "type": "triangle"
  },
  "envelope": {
    "attack": 0.2,
    "decay": 0.3,
    "sustain": 0.1,
    "release": 1.2
  },
  "modulation" : {
    "type": "square"
  },
  "modulationEnvelope" : {
    "attack": 0.01,
    "decay": 0.5,
    "sustain": 0.2,
    "release": 0.1
  }
});

kalimba.set({
  "harmonicity":8,
  "modulationIndex": 2,
  "oscillator" : {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.001,
    "decay": 2,
    "sustain": 0.1,
    "release": 2
  },
  "modulation" : {
    "type" : "square"
  },
  "modulationEnvelope" : {
    "attack": 0.002,
    "decay": 0.2,
    "sustain": 0,
    "release": 0.2
  }
});

bassGuitar.set({
  "oscillator": {
    "type": "fmsquare5",
  "modulationType" : "triangle",
    "modulationIndex" : 2,
    "harmonicity" : 0.501
  },
  "filter": {
    "Q": 1,
    "type": "lowpass",
    "rolloff": -24
  },
  "envelope": {
    "attack": 0.01,
    "decay": 0.1,
    "sustain": 0.4,
    "release": 2
  },
  "filterEnvelope": {
    "attack": 0.01,
    "decay": 0.1,
    "sustain": 0.8,
    "release": 1.5,
    "baseFrequency": 50,
    "octaves": 4.4
  }
});

module.exports = {
  whatever: whatever,
  treeTrunk: treeTrunk,
  steelPan: steelPan,
  delicate: delicate,
  harmonic: harmonic,
  eletricCello: eletricCello,
  kalimba: kalimba,
  bassGuitar: bassGuitar
}
