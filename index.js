'use strict';

var STATIC_MESSAGES = require('./constants.js').STATIC_MESSAGES;

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(toneClass, wsAdapter, drawingAdapter){
      this.tone = toneClass;
      this.wsAdapter = wsAdapter;
      this.drawingAdapter = drawingAdapter;
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

      var synth = this.getInstrumentForChannel(channel);

      var accTime = 0;

      for (var word of text.split(' ')) {
        if (word.length == 0){
          accTime += SPM.CHAR_TIME; // blank space
          continue;
        }

        var note = this.getNoteFromWord(word);
        var time = this.getSustainFromWord(word);

        synth.triggerAttackRelease(note, time, '+' + accTime);

        accTime += time;
      }

      this.draw(text, channel, user);
    }

    SPM.prototype.draw = function(text, channel, user) {
      var channelDiv = $('#' + channel);

      if (channelDiv.length == 0) {
        channelDiv = $('<div class="channel" id="' + channel + '"></div>');
        channelDiv.append('<span> ' + channel + '</span>');
        $('#panel').append(channelDiv);
        channelDiv.animate({flexGrow: 1}); // all for the beauty of the world
        channelDiv.css({background: this.getColorForChannel(channel)});
      }

      var activityDiv = $('<div class="activity"></div>');
      activityDiv.append('<span> @' + user + '.</span>'); // TODO add activity description
      channelDiv.append(activityDiv);
      activityDiv.animate({flexGrow: 1});

      var accTime = 0;

      for (var word of text.split(' ')) {
        if (word.length == 0){
          accTime += SPM.CHAR_TIME; // blank space
          continue;
        }

        var time = this.getSustainFromWord(word);

        (function(_this, _word){
          setTimeout(function(){
            activityDiv.css({background: _this.getColorFromWord(_word)});
          }, accTime * 1000);
        }(this, word));

        accTime += time;
      }

      setTimeout(function(){
        activityDiv.css({transition: 'initial'});
        activityDiv.animate({flexGrow: 0, height: 0}, 500, 'swing', function(){
          activityDiv.remove();

          if(channelDiv.find('div').length == 0) {
            channelDiv.animate({flexGrow: 0, height: 0}, 500, 'swing', function(){
              channelDiv.remove();
            }); // OMG this indentation D:
          }
        });
      }, accTime * 1000);
    }

    SPM.prototype.getInstrumentForChannel = function(channel) {
      // return new this.tone.Synth({
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
      return new this.tone.Synth().toMaster();
    }

    SPM.prototype.getColorForChannel = function (channel) {
      return '#ccc';
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
