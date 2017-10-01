'use strict';

/**
 * Plays Crazy Music
 * @return {object}
 */
module.exports = function() {

    var SPM = function(){};

    var Tone = require('tone');

    SPM.play = function() {
      //a 4 voice Synth
      var polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();
      //play a chord
      polySynth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n");

    }

    return SPM;
}(this);
