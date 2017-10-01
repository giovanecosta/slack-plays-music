'use strict';

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(){};

    var Tone = require('tone');

    SPM.play = function(text, channel) {

      var synth = SPM.getInstrumentForChannel(channel);

      var note = SPM.getNoteFromText(text);

      var time = SPM.getSustainFromText(text);

      synth.triggerAttackRelease(note, time);

    }

    SPM.getInstrumentForChannel = function(channel) {
      return new Tone.Synth({
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
      }).toMaster();
    }

    SPM.getNoteFromText = function(text) {
      var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      var note = 'C';
      var octave = 1;
      var maxLength = notes.length * 5;

      var charCode = -1; // chr('!') == 33

      for (var l of text.split('')) {
        charCode += l.charCodeAt(0) - 32;
      }

      charCode = (charCode % maxLength);
      octave = Math.floor(charCode / notes.length) + 1;
      note = notes[charCode % notes.length];

      console.log(note + octave);

      return note + octave;
    }

    SPM.getSustainFromText = function(text) {
      return text.length * 0.1;
    }

    return SPM;
}(this);
