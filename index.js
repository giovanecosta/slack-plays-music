'use strict';

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(toneClass){
      this.tone = toneClass;
    };

    SPM.prototype.connect = function() {
      window.WebSocket = window.WebSocket || window.MozWebSocket;

      var connection = new WebSocket('ws://' + window.location.hostname + ':1337');

      connection.onopen = function () {
        console.log('[WS conn OK]');
      };

      connection.onerror = function (error) {
        console.log('Some error with WebSocket');
      };

      var _that = this;
      connection.onmessage = function (message) {
        try {
          var json = JSON.parse(message.data);
        } catch (e) {
          console.log('This doesn\'t look like a valid JSON: ', message.data);
          return;
        }

        _that.play(json.text, json.channel, json.user);
      };
    }

    SPM.prototype.start = function() {
      this.connect();
    }

    SPM.prototype.play = function(text, channel, user) {

      var channelDiv = $('<div class="' + channel + '"></div>');
      channelDiv.append('<span> @' + user + ' in ' + channel + '.</span>');
      $('#panel').append(channelDiv);
      channelDiv.animate({flexGrow: 1}); // all for the beauty of the world

      var synth = this.getInstrumentForChannel(channel);

      var accTime = 0;

      for (var word of text.split(' ')) {
        if (word.length == 0){
          accTime += 0.5;
          continue;
        }

        var note = this.getNoteFromWord(word);
        var time = this.getSustainFromWord(word);

        synth.triggerAttackRelease(note, time, '+' + accTime);

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
      }, accTime * 1000); // 0.5s transition
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

    SPM.prototype.getColorFromWord = function(word) {
      var maxLength = 256 * 256 * 256;

      var charCode = -1; // chr('!') == 33

      for (var l of word.split('')) {
        charCode += (l.charCodeAt(0) - 32) * Math.floor(maxLength / 60); // must sync with notes C1 = black B5 = white
      }

      charCode = (charCode % maxLength);

      var color = '#' + ('000000' + (charCode).toString(16)).slice(-6);

      return color;
    }

    SPM.prototype.getNoteFromWord = function(word) {
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

    SPM.prototype.getSustainFromWord = function(word) {
      return word.length * 0.1;
    }

    return SPM;
}(this);
