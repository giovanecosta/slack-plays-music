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

    SPM.MIN_OCTAVE = 2;

    SPM.MAX_OCTAVE = 5;

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

      for (var part of text.match(/(.!*)/g)) {

        var time = this.getSustainFromPart(part);

        if (part.startsWith(' ')){
          accTime += time; // blank space
          continue;
        }

        var note = this.getNoteFromPart(part);
        var color = this.getColorFromPart(part);


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
    SPM.prototype.getMagicNumberFromPart = function(part) {
      var maxLength = SPM.NOTES.length * (SPM.MAX_OCTAVE - SPM.MIN_OCTAVE + 1);

      part = part.replace(/!/g, '');

      if(part.length == 0) {
        return 0;
      }

      var charCode = (part.charCodeAt(0) - '"'.charCodeAt(0)) % maxLength; // " is the first valid char
      charCode = charCode < 0 ? 0 : charCode;

      return charCode;
    }

    SPM.prototype.getColorFromPart = function(part) {
      var maxLength = 256 * 256 * 256; // #FFFFFF
      var maxMagicNumberLength = SPM.NOTES.length * (SPM.MAX_OCTAVE - SPM.MIN_OCTAVE + 1);
      part = part.replace(/!/g, '');

      var magicNumber = this.getMagicNumberFromPart(part);

      magicNumber = Math.floor((magicNumber * maxLength) / maxMagicNumberLength);

      return '#' + ('000000' + (magicNumber).toString(16)).slice(-6);
    }

    SPM.prototype.getNoteFromPart = function(part) {
      var notes = SPM.NOTES;
      var octave = SPM.MIN_OCTAVE;
      var note = notes[0];

      var magicNumber = this.getMagicNumberFromPart(part);

      octave = Math.floor(magicNumber / notes.length) + SPM.MIN_OCTAVE;
      note = notes[magicNumber % notes.length];
      return note + octave;
    }

    SPM.prototype.getSustainFromPart = function(part) {
      return part.length * SPM.CHAR_TIME;
    }

    return SPM;
}();
