'use strict';

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(toneClass){
      this.tone = toneClass;
      this.connection = undefined;
    };

    SPM.NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    SPM.MIN_OCTAVE = 1;

    SPM.MAX_OCTAVE = 6;

    SPM.CHAR_TIME = 0.25; // in seconds

    SPM.prototype.start = function() {
      window.WebSocket = window.WebSocket || window.MozWebSocket;

      this.connect(window.WebSocket);
    }

    SPM.prototype.setupConnection = function() {
      this.connection.onopen = function () {
        console.log('[WS conn OK]');
      };

      this.connection.onclose = (function (_this) {
        return function() {
          console.log('[WS closed]');
          window.setTimeout(function(){
            _this.connect(window.WebSocket);
          }, 1000);
        }
      })(this);

      this.connection.onerror = function (error) {
        console.log('Some error with WebSocket');
      };

      this.connection.onmessage = this.onWsMessage.bind(this);
    }

    SPM.prototype.onWsMessage = function(message) {
      try {
        var json = JSON.parse(message.data);
      } catch (e) {
        console.log('This doesn\'t look like a valid JSON: ', message.data);
        return;
      }

      this.play(json.text, json.channel, json.user);
    }

    SPM.prototype.connect = function(WebSocketClass) {
      this.connection = new WebSocketClass('ws://' + window.location.hostname + ':1337');
      this.setupConnection();
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
      var channelDiv = $('<div class="' + channel + '"></div>');
      channelDiv.append('<span> @' + user + ' in ' + channel + '.</span>');
      $('#panel').append(channelDiv);
      channelDiv.animate({flexGrow: 1}); // all for the beauty of the world

      var accTime = 0;

      for (var word of text.split(' ')) {
        if (word.length == 0){
          accTime += SPM.CHAR_TIME; // blank space
          continue;
        }

        var time = this.getSustainFromWord(word);

        (function(_this, _word){
          window.setTimeout(function(){
            channelDiv.css({background: _this.getColorFromWord(_word)});
          }, accTime * 1000);
        }(this, word));

        accTime += time;
      }

      window.setTimeout(function(){
        channelDiv.css({transition: 'initial'});
        channelDiv.animate({flexGrow: 0, height: 0}, 500, 'swing', function(){
          channelDiv.remove();
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
}(this);
