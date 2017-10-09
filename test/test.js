'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var SPM = require('../index');

var drawAgent = {animate: sinon.spy(), destroy: sinon.spy()};

var drawAdapter = {
  draw: function() {
    return drawAgent;
  }
};

var Instruments = {
  standard: {play: sinon.spy(), destroy: sinon.spy(), get: function(){ return Instruments.standard }},
  standard2: {play: sinon.spy(), destroy: sinon.spy(), get: function(){ return Instruments.standard2 }},
  another: {play: sinon.spy(), destroy: sinon.spy(), get: function(){ return Instruments.another }},
  another2: {play: sinon.spy(), destroy: sinon.spy(), get: function(){ return Instruments.another2 }},
  whatelse: {play: sinon.spy(), destroy: sinon.spy(), get: function(){ return Instruments.whatelse }},
  leitgo: {play: sinon.spy(), destroy: sinon.spy(), get: function(){ return Instruments.leitgo }}
};

var wsAdapter = {connect: sinon.spy(), registerListener: sinon.spy()};

describe('#SlackPlaysMusic', function() {

  describe('Main functionality', function(){

    context('Start App', function(){

      it('should construct the object', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);
        expect(spm).to.be.an.instanceof(SPM);
      });

      it('should expose start function', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);
        expect(spm).to.respondTo('start');
      });

      it('should call wsAdapter.connect on start', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);
        spm.start();
        expect(wsAdapter.connect.called).to.be.true;
      });

      it('should call play on WebSocket message', function() {
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);
        spm.start();
        var play = sinon.stub(spm, 'play');

        spm.onWsMessage({text: 'foo', channel: 'bar', user: 'zaa'});
        expect(play.calledWith('foo', 'bar', 'zaa')).to.be.true;
      });

    });

    context('Play! :D', function(){
      var draw = sinon.stub(drawAdapter, 'draw').returns(drawAgent);

      it('Should play instrument', function(){
        var spm = new SPM({standard: Instruments.standard}, wsAdapter, drawAdapter);
        spm.play('foo bar', 'bar foo', 'zaa');

        var note = spm.getNoteFromPart('f');

        expect(Instruments.standard.play.called).to.be.true;
        expect(Instruments.standard.play.calledWith(note, 0.25, '+0')).to.be.true;
      });

      it('Should play a chord', function(){
        var spm = new SPM({standard: Instruments.standard}, wsAdapter, drawAdapter);
        spm.play("foo\nbar\nzaa", 'bar foo', 'zaa');

        var notes = ['f', 'b', 'z'].map(function(_k){ return spm.getNoteFromPart(_k); });

        expect(Instruments.standard.play.called).to.be.true;
        expect(Instruments.standard.play.calledWith(notes, 0.25, '+0')).to.be.true;
      });


      it('Should call draw adapter', function(){

        var spm = new SPM(Instruments, wsAdapter, drawAdapter);
        spm.play('foo', 'bar', 'zaa');

        var color = spm.getColorFromPart('f');


        expect(draw.calledWith('bar', '@zaa')).to.be.true;
        expect(drawAgent.animate.calledWith([color], 0)).to.be.true;
        expect(drawAgent.destroy.calledWith(0.75)).to.be.true;
      });

      it('Should not fail starting with a ! or charcode less than !', function(){

        var spm = new SPM({standard: Instruments.standard}, wsAdapter, drawAdapter);
        spm.play('!' + String.fromCharCode(9), 'zaa', 'bar');

        var note = spm.getNoteFromPart('!');
        var color = spm.getColorFromPart('!');

        expect(Instruments.standard.play.called).to.be.true;
        expect(Instruments.standard.play.calledWith(note, 0.25, '+0')).to.be.true;
        expect(draw.calledWith('zaa', '@bar')).to.be.true;
        expect(drawAgent.animate.calledWith([color], 0)).to.be.true;
        expect(drawAgent.destroy.calledWith(0.5)).to.be.true;
      });

    });

  });

  describe('Transform functions', function(){

    context('Normalized Lines', function(){

      it('Should return normal notes', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);

        expect(spm.getNormalizedLines([['a', 'b']])).to.have.deep.members([['a'], ['b']]);
        expect(spm.getNormalizedLines([['a!', 'b']])).to.have.deep.members([['a!'], ['b']]);
      });

      it('Should return double chord', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);

        expect(spm.getNormalizedLines([['a', 'c'], ['b', 'b']])).to.have.deep.members([['a', 'b'], ['c', 'b']]);
        expect(spm.getNormalizedLines([['a!', 'c'], ['b', 'b!']])).to.have.deep.members([['a', 'b'], ['a', 'b'], ['c', 'b']]);
        expect(spm.getNormalizedLines([['a!', 'c'], ['b', 'b']])).to.have.deep.members([['a', 'b'], ['a', 'b'], ['c', ' ']]);
      });

      it('Should return triple chord', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);

        expect(spm.getNormalizedLines([['a', 'c'], ['b', 'b'], ['c', 'a']])).to.have.deep.members([['a', 'b', 'c'], ['c', 'b', 'a']]);
        expect(spm.getNormalizedLines([['a!', 'c'], ['b', 'b!'], ['c', 'a!']])).to.have.deep.members([['a', 'b', 'c'], ['a', 'b', 'a'], ['c', 'b', 'a']]);
        expect(spm.getNormalizedLines([['a!', 'c'], ['b', 'b'], ['c']])).to.have.deep.members([['a', 'b', 'c'], ['a', 'b', ' '], ['c', ' ', ' ']]);
        expect(spm.getNormalizedLines([['a!!', 'c'], ['b!', 'b'], ['c!']])).to.have.deep.members([['a!', 'b!', 'c!'], ['a', 'b', ' '], ['c', ' ', ' ']]);
      });

    });

    context('Choose instrument', function(){

      it('Should return an instrument', function(){
        var spm = new SPM(Instruments, wsAdapter, drawAdapter);
        expect(spm.getInstrumentForChannel('bar')).to.respondTo('play');
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
        color = SPM.prototype.getColorFromPart(' ');
        expect(color).to.equal('transparent');
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
