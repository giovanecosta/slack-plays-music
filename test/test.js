'use strict';

var expect = require('chai').expect;
var SPM = require('../index');

describe('#SlackPlaysMusic', function() {

  context('MagicNumbers', function(){

    it('should return 0', function() {
      var magicNumber = SPM.prototype.getMagicNumberFromWord('!');
      expect(magicNumber).to.equal(0);
      magicNumber = SPM.prototype.getMagicNumberFromWord('i');
      expect(magicNumber).to.equal(0);
    });

    it('should return 71', function() {
      var magicNumber = SPM.prototype.getMagicNumberFromWord('h');
      expect(magicNumber).to.equal(71);
    });
  });

});
