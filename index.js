'use strict';

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(){};

    var Tone = require('tone');

    var $ = require('jquery');

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

        SPM.play(json.text, json.channel, json.user);
      };
    }

    SPM.start = function() {
      SPM.connect();
    }

    SPM.play = function(text, channel, user) {
      // TODO separate play from draw
      var channelDiv = $('#' + channel);

      // Verify if a can play with div presence can not be the best way but is very simpĺe
      if (channelDiv.length == 0) {
        channelDiv = $('<div id="' + channel + '"></div>');
        channelDiv.append('<span> @' + user + ' in ' + channel + '.</span>');
        $('#panel').append(channelDiv);

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

          (function(_word){
            window.setTimeout(function(){
              channelDiv.css({backgroundColor: SPM.getColorFromWord(_word)});
            }, accTime * 1000);
          }(word));

          accTime += time;
        }

        window.setTimeout(function(){
          channelDiv.remove();
        }, accTime * 1000);

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

    SPM.getColorFromWord = function(word) {
      var maxLength = 256 * 256 * 256;

      var charCode = -1; // chr('!') == 33

      for (var l of word.split('')) {
        charCode += (l.charCodeAt(0) - 32) * Math.floor(maxLength / 60); // must sync with notes C1 = black B5 = white
      }

      charCode = (charCode % maxLength);

      var color = '#' + ('000000' + (charCode).toString(16)).slice(-6);

      console.log(color)

      return color;
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
