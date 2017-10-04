'use strict';

var Tone = require('tone');

module.exports = {
  whatever: new Tone.Synth({
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
  }),

  treeTrunk: new Tone.Synth({
      "oscillator": {
          "type": "sine"
      },
      "envelope": {
          "attack": 0.001,
          "decay": 0.1,
          "sustain": 0.1,
          "release": 1.2
      }
  }),

  steelPan: new Tone.Synth({
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
  }),

  delicate: new Tone.Synth({
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
  }),

  harmonic: new Tone.AMSynth({
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
  }),

  eletricCello: new Tone.FMSynth({
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
  }),

  kalimba: new Tone.FMSynth({
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
  }),

  bassGuitar: new Tone.MonoSynth({
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
  })
}
