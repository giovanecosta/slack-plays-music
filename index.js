'use strict';

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(){};

    var Tone = require('tone');

    SPM.connect = function() {
      window.WebSocket = window.WebSocket || window.MozWebSocket;

      var connection = new WebSocket('ws://127.0.0.1:1337');

      connection.onopen = function () {
        console.log('[WS conn OK]');
      };

      connection.onerror = function (error) {
        console.log('Some error with WebSocket');
      };

      connection.onmessage = function (message) {
        try {
          var json = JSON.parse(message.data);
        } catch (e) {
          console.log('This doesn\'t look like a valid JSON: ', message.data);
          return;
        }

        SPM.play(json.text, json.channel);
      };
    }

    SPM.start = function() {
      SPM.connect();
    }

    SPM.play = function(text, channel) {

      var synth = SPM.getInstrumentForChannel(channel);

      var accTime = 0;

      for (var word of text.split(' ')) {
        if (word.length == 0){
          accTime += 0.5;
          continue;
        }

        var note = SPM.getNoteFromWord(word);
        var time = SPM.getSustainFromWord(word);

        synth.triggerAttackRelease(note, time, '+' + accTime);

        accTime += time;
      }
    }

    SPM.getInstrumentForChannel = function(channel) {
      // return new Tone.Synth({
      //   "oscillator" : {
      //     "type" : "pwm",
      //     "modulationFrequency" : 0.2
      //   },
      //   "envelope" : {
      //     "attack" : 0.02,
      //     "decay" : 0.1,
      //     "sustain" : 0.2,
      //     "release" : 0.9,
      //   }
      // }).toMaster();
      return new Tone.Synth().toMaster();
    }

    SPM.getNoteFromWord = function(word) {
      var notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      var note = 'C';
      var octave = 1;
      var maxLength = notes.length * 5;

      if (word.length == 0) {
        return notes[0] + octave;
      }

      var charCode = -1; // chr('!') == 33

      for (var l of word.split('')) {
        charCode += l.charCodeAt(0) - 32;
      }

      charCode = (charCode % maxLength);
      octave = Math.floor(charCode / notes.length) + 1;
      note = notes[charCode % notes.length];

      return note + octave;
    }

    SPM.getSustainFromWord = function(word) {
      return word.length * 0.1;
    }

    return SPM;
}(this);
