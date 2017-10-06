'use strict';

var Tone = require('tone');

/**
 * Provide a Instrument wrapper for Tone
 * @return {object}
 */
module.exports = function() {

  var Instrument = function(synthClass) {
    this.synthClass = synthClass;
    this.synth = false;
  }

  Instrument.prototype.play = function (note, duration, delay) {
    if (this.synth) {
      this.synth.triggerAttackRelease(note, duration, delay);
    }
  }

  Instrument.prototype.get = function (channels) {
    if (channels > 1) {
      this.synth = new Tone.PolySynth(channels, this.synthClass).toMaster();
      this.synth.set(this.options);
    } else {
      this.synth = new this.synthClass(this.options).toMaster();
    }
    return this;
  }

  Instrument.prototype.set = function (options) {
    this.options = options;
  }

  Instrument.prototype.destroy = function(delay) {
    setTimeout((function(){
      if (this.synth) {
        this.synth.disconnect();
      }
    }).bind(this), delay * 1000)
  }

  return Instrument;
}();
