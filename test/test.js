'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var SPM = require('../index');
var MockTone = {};
var drawingAdapter = {};

var Tone = (function(){
  var Synth = function(){}

  Synth.prototype.toMaster = sinon.spy();

  return Synth
});

var wsAdapter = {connect: sinon.spy(), registerListener: sinon.spy()};

describe('#SlackPlaysMusic', function() {

  describe('Main functionality', function(){

    context('Start App', function(){

      it('should call wsAdapter.connect on start', function(){
        var spm = new SPM(Tone, wsAdapter, drawingAdapter);
        spm.start();
        expect(wsAdapter.connect.called).to.be.true;
      });

      it('should call play on WebSocket message', function() {
        var spm = new SPM(MockTone, wsAdapter, drawingAdapter);
        spm.start();
        var play = sinon.stub(spm, 'play');

        spm.onWsMessage({text: 'foo', channel: 'bar', user: 'zaa'});
        expect(play.calledWith('foo', 'bar', 'zaa')).to.be.true;
      });

    });

    context('Play! :D', function(){

      xit('Should play instrument', function(){
        // Todo implements when play things get testable
      })

      xit('Should draw activity', function(){
        // TODO implements when draw things get testable
      });
    });

  });

  describe('Transform functions', function(){

    context('Choose instrument', function(){

      xit('Should return standard', function(){
        // TODO implements when instuments logic is done
      })
    });

    context('MagicNumber', function(){

      it('should return 0', function() {
        var magicNumber = SPM.prototype.getMagicNumberFromWord('!');
        expect(magicNumber).to.equal(0);
        magicNumber = SPM.prototype.getMagicNumberFromWord('i');
        expect(magicNumber).to.equal(0);
        magicNumber = SPM.prototype.getMagicNumberFromWord('hi');
        expect(magicNumber).to.equal(0);
      });

      it('should return 71', function() {
        var magicNumber = SPM.prototype.getMagicNumberFromWord('h');
        expect(magicNumber).to.equal(71);
        magicNumber = SPM.prototype.getMagicNumberFromWord('hh');
        expect(magicNumber).to.equal(71);
      });
    });


    context('Color', function(){

      it('should return #000000', function(){
        var color = SPM.prototype.getColorFromWord('!');
        expect(color).to.equal('#000000');
        color = SPM.prototype.getColorFromWord('i');
        expect(color).to.equal('#000000');
        color = SPM.prototype.getColorFromWord('hi');
        expect(color).to.equal('#000000');
      });

      // max possible color with default config
      it('should return #fc71c7', function(){
        var color = SPM.prototype.getColorFromWord('h');
        expect(color).to.equal('#fc71c7');
        color = SPM.prototype.getColorFromWord('hh');
        expect(color).to.equal('#fc71c7');
      });

    });


    context('Note', function(){

      it('should return C1', function(){
        var note = SPM.prototype.getNoteFromWord('!');
        expect(note).to.equal('C1');
        note = SPM.prototype.getNoteFromWord('i');
        expect(note).to.equal('C1');
        note = SPM.prototype.getNoteFromWord('hi');
        expect(note).to.equal('C1');
      });

      it('should return B6', function(){
        var note = SPM.prototype.getNoteFromWord('h');
        expect(note).to.equal('B6');
        note = SPM.prototype.getNoteFromWord('hh');
        expect(note).to.equal('B6');
      });
    });

    context('Sustain', function(){
      it('should return 0.25', function(){
        var sustain = SPM.prototype.getSustainFromWord('!');
        expect(sustain).to.equal(0.25);
        sustain = SPM.prototype.getSustainFromWord('i');
        expect(sustain).to.equal(0.25);
      });

      it('should return 1', function(){
        var sustain = SPM.prototype.getSustainFromWord('hder');
        expect(sustain).to.equal(1);
        sustain = SPM.prototype.getSustainFromWord('hhe3');
        expect(sustain).to.equal(1);
      });
    });
  });


});
