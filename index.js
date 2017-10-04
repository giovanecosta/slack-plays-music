'use strict';

var STATIC_MESSAGES = require('./constants.js').STATIC_MESSAGES;

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(instruments, wsAdapter, drawAdapter){
      this.instruments = instruments;
      this.wsAdapter = wsAdapter;
      this.drawAdapter = drawAdapter;
    };

    SPM.NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    SPM.MIN_OCTAVE = 1;

    SPM.MAX_OCTAVE = 6;

    SPM.CHAR_TIME = 0.25; // in seconds

    SPM.prototype.start = function() {
      this.wsAdapter.registerListener(this.onWsMessage.bind(this));
      this.wsAdapter.connect();
    }

    SPM.prototype.onWsMessage = function(json) {
      this.play(json.text, json.channel, json.user);
    }

    SPM.prototype.play = function(text, channel, user) {
      console.log('@' + user + ' in ' + channel);

      var instrument = this.getInstrumentForChannel(channel);
      var drawAgent = this.drawAdapter.draw(channel, '@' + user); // adds activity description

      var accTime = 0;

      for (var word of text.split(' ')) {
        if (word.length == 0){
          accTime += SPM.CHAR_TIME; // blank space
          continue;
        }

        var note = this.getNoteFromWord(word);
        var time = this.getSustainFromWord(word);
        var color = this.getColorFromWord(word);


        instrument.play(note, time, '+' + accTime);
        drawAgent.animate(color, accTime);

        accTime += time;
      }

      drawAgent.destroy(accTime);
    }

    SPM.prototype.getInstrumentForChannel = function(channel) {
      var instrument;
      // random for now
      for (instrument in this.instruments) {
        if(Math.random() < (1 / Object.keys(this.instruments).length)) {
          break;
        }
      }

      return this.instruments[instrument];
    }

    // I really don't know how can i name this number
    SPM.prototype.getMagicNumberFromWord = function(word) {
      var maxLength = SPM.NOTES.length * (SPM.MAX_OCTAVE - SPM.MIN_OCTAVE + 1);
      var charCode = -1;
      for (var l of word.split('')) {
        charCode += l.charCodeAt(0) - '!'.charCodeAt(0) + 1; // ! is the first valid char
      }
      return charCode % maxLength;
    }

    SPM.prototype.getColorFromWord = function(word) {
      var maxLength = 256 * 256 * 256; // #FFFFFF
      var maxMagicNumberLength = SPM.NOTES.length * (SPM.MAX_OCTAVE - SPM.MIN_OCTAVE + 1);
      var magicNumber = this.getMagicNumberFromWord(word);

      magicNumber = Math.floor((magicNumber * maxLength) / maxMagicNumberLength);

      return '#' + ('000000' + (magicNumber).toString(16)).slice(-6);
    }

    SPM.prototype.getNoteFromWord = function(word) {
      var notes = SPM.NOTES;
      var octave = SPM.MIN_OCTAVE;
      var note = notes[0];

      if (word.length == 0) {
        return notes[0] + octave; // just a fallback
      }

      var magicNumber = this.getMagicNumberFromWord(word);

      octave = Math.floor(magicNumber / notes.length) + 1;
      note = notes[magicNumber % notes.length];
      return note + octave;
    }

    SPM.prototype.getSustainFromWord = function(word) {
      return word.length * SPM.CHAR_TIME;
    }

    return SPM;
}();
