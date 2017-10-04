'use strict';

/**
 * Provide a Instrument wrapper for Tone
 * @return {object}
 */
module.exports = function() {

  var Instrument = function(synthObject) {
    this.synth = synthObject.toMaster();
  }

  Instrument.prototype.play = function(note, duration, delay) {
    this.synth.triggerAttackRelease(note, duration, delay);
  }

  return Instrument;
}();
