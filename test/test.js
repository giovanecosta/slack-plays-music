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
        var magicNumber = SPM.prototype.getMagicNumberFromPart('"');
        expect(magicNumber).to.equal(0);
        magicNumber = SPM.prototype.getMagicNumberFromPart('R');
        expect(magicNumber).to.equal(0);
        magicNumber = SPM.prototype.getMagicNumberFromPart('R!');
        expect(magicNumber).to.equal(0);
      });

      it('should return 47', function() {
        var magicNumber = SPM.prototype.getMagicNumberFromPart('Q');
        expect(magicNumber).to.equal(47);
        magicNumber = SPM.prototype.getMagicNumberFromPart('Q!!');
        expect(magicNumber).to.equal(47);
      });
    });


    context('Color', function(){

      it('should return #000000', function(){
        var color = SPM.prototype.getColorFromPart('"');
        expect(color).to.equal('#000000');
        color = SPM.prototype.getColorFromPart('R');
        expect(color).to.equal('#000000');
        color = SPM.prototype.getColorFromPart('R!');
        expect(color).to.equal('#000000');
      });

      // max possible color with default config
      it('should return #fc71c7', function(){
        var color = SPM.prototype.getColorFromPart('Q');
        expect(color).to.equal('#faaaaa');
        color = SPM.prototype.getColorFromPart('Q!!');
        expect(color).to.equal('#faaaaa');
      });

    });


    context('Note', function(){

      it('should return C2', function(){
        var note = SPM.prototype.getNoteFromPart('"');
        expect(note).to.equal('C2');
        note = SPM.prototype.getNoteFromPart('R');
        expect(note).to.equal('C2');
        note = SPM.prototype.getNoteFromPart('R!!');
        expect(note).to.equal('C2');
      });

      it('should return B5', function(){
        var note = SPM.prototype.getNoteFromPart('Q');
        expect(note).to.equal('B5');
        note = SPM.prototype.getNoteFromPart('Q!');
        expect(note).to.equal('B5');
      });
    });

    context('Sustain', function(){
      it('should return 0.25', function(){
        var sustain = SPM.prototype.getSustainFromPart('!');
        expect(sustain).to.equal(0.25);
        sustain = SPM.prototype.getSustainFromPart('i');
        expect(sustain).to.equal(0.25);
      });

      it('should return 1', function(){
        var sustain = SPM.prototype.getSustainFromPart('hder');
        expect(sustain).to.equal(1);
        sustain = SPM.prototype.getSustainFromPart('hhe3');
        expect(sustain).to.equal(1);
      });
    });
  });


});
