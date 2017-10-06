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

    SPM.MULTI_LINES = 3;

    SPM.prototype.start = function() {
      this.wsAdapter.registerListener(this.onWsMessage.bind(this));
      this.wsAdapter.connect();
    }

    SPM.prototype.onWsMessage = function(json) {
      this.play(json.text, json.channel, json.user);
    }

    SPM.prototype.play = function(text, channel, user) {
      console.log('@' + user + ' in ' + channel);

      var lines = text.split('\n');

      var instrument = this.getInstrumentForChannel(channel, Math.min(lines.length, SPM.MULTI_LINES));
      var drawAgent = this.drawAdapter.draw(channel, '@' + user); // adds activity description

      var accTime = 0;

      this.processLines(lines, (function(part) {

        var time = this.getSustainFromPart(part);

        if (part.join('').replace(/ /g, '').length == 0){
          accTime += time; // blank space
          return;
        }

        var notes = part.map((function(p){ return this.getNoteFromPart(p); }).bind(this));
        if (notes.length == 1){
          notes = notes[0];
        }

        var colors = part.map((function(p){ return this.getColorFromPart(p); }).bind(this));
        console.log(time);
        instrument.play(notes, time, '+' + accTime);
        drawAgent.animate(colors, accTime);

        accTime += time;
      }).bind(this));

      drawAgent.destroy(accTime);
      instrument.destroy(accTime + 0.5);
    }

    SPM.prototype.processLines = function(lines, callback) {
      do {

        var chordLines = lines.splice(0, SPM.MULTI_LINES).map(function(line){
          return line.match(/(.!*)/g);
        });

        var p = 0;
        while (true) {
          var parts = [];
          var normalizedParts = [];
          var continueProcessing = false;

          for(var i = 0; i < chordLines.length; i++) {
            if (chordLines[i].length > 0) {
              continueProcessing = true;
              parts.push(chordLines[i].shift());
            } else {
              parts.push(' ');
            }
          }

          if (!continueProcessing) {
            break;
          }

          var minLengthPart = Math.min.apply(this, parts.map(function(_k){ return _k.length; }));

          for(var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part.length > minLengthPart) {
              var newPart = part.slice(0, minLengthPart);
              chordLines[i].unshift(part.slice(minLengthPart).replace(/^!/, newPart.charAt(0)));
              part = newPart;
            }
            normalizedParts.push(part);
          }

          callback(normalizedParts);
          p++;
        }
      } while (chordLines.length > 0)
    }

    SPM.prototype.getInstrumentForChannel = function(channel, lines) {
      var instrument;
      lines = lines || 1;
      // random for now
      for (instrument in this.instruments) {
        if(Math.random() < (1 / Object.keys(this.instruments).length)) {
          break;
        }
      }

      return this.instruments[instrument].get(lines);
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

      if (part == ' ') {
        return 'transparent';
      }

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
